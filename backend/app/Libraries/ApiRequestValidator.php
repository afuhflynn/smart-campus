<?php

declare(strict_types=1);

namespace App\Libraries;

use JsonException;

class ApiRequestValidator
{
    /**
     * Default validation messages.
     *
     * Placeholders:
     * - {field} => field path
     * - {rule}  => rule name
     * - {param} => rule parameter
     * - {value} => actual value when scalar or JSON stringified for arrays/objects
     *
     * @var array<string, string>
     */
    protected array $defaultMessages = [
        'required'      => '{field} is required.',
        'nullable'      => '{field} cannot be null.',
        'string'        => '{field} must be a string.',
        'int'           => '{field} must be an integer.',
        'integer'       => '{field} must be an integer.',
        'float'         => '{field} must be a float.',
        'double'        => '{field} must be a float.',
        'bool'          => '{field} must be a boolean.',
        'boolean'       => '{field} must be a boolean.',
        'array'         => '{field} must be an array.',
        'numeric'       => '{field} must be numeric.',
        'email'         => '{field} must be a valid email address.',
        'url'           => '{field} must be a valid URL.',
        'ip'            => '{field} must be a valid IP address.',
        'uuid'          => '{field} must be a valid UUID.',
        'alpha'         => '{field} must contain only letters.',
        'alpha_numeric' => '{field} must contain only letters and numbers.',
        'alpha_dash'    => '{field} must contain only letters, numbers, underscores, or dashes.',
        'username'      => 'Username must contain 3 - 30 characters, starts with a letter or number and contain no special characters except dot, underscore and dash',
        'password'      => 'Password must contain 8 - 120 characters, at least 1 lowercase letter, 1 uppercase letter, 1 numer and a special character',
        'min_length'    => '{field} must be at least {param} characters long.',
        'max_length'    => '{field} must not exceed {param} characters.',
        'min'           => '{field} must be at least {param}.',
        'max'           => '{field} must not be greater than {param}.',
        'in'            => '{field} contains an invalid value.',
        'same'          => '{field} must match {param}.',
        'regex'         => '{field} has an invalid format.',
        'unexpected'    => '{field} is not allowed.',
        'invalid_json'  => 'Invalid JSON payload.',
        'invalid_data'  => 'Payload must be an associative array.',
        'unknown_rule'  => '{field} rule: {rule}.',
    ];

    /**
     * Validate request body payload against rule strings.
     *
     * Supported:
     * - raw JSON string or decoded array
     * - nested keys with dot notation
     * - strict unexpected field rejection
     * - per-field custom messages with fallback to defaults
     *
     * Rule examples:
     * - required
     * - nullable
     * - string
     * - int | integer
     * - float | double
     * - bool | boolean
     * - array
     * - numeric
     * - email
     * - url
     * - ip
     * - uuid
     * - alpha
     * - alpha_numeric
     * - alpha_dash
     * - username
     * - password
     * - min_length[3]
     * - max_length[50]
     * - min[18]
     * - max[120]
     * - in[admin,user,guest]
     * - same[profile.email]
     * - regex[/^[A-Z]+$/]
     *
     * @param string|array $input
     *   Raw JSON string or already-decoded associative array.
     *
     * @param array<string, string> $rules
     *   Validation rules keyed by field path.
     *
     * @param array<string, array<string, string>> $messages
     *   Custom messages keyed by field and rule.
     *
     * @example
     * ```php
     * $validator = new \App\Libraries\ApiRequestValidator();
     *
     * $rules = [
     * 'username' => 'required|username|min_length[3]|max_length[30]',
     * 'password' => 'required|password',
     * 'profile.email' => 'required|email',
     * 'profile.age' => 'nullable|int|min[13]|max[120]',
     * ];
     *
     * $messages = [
     * 'username' => [
     * 'required'   => 'Username is required.',
     * 'username'   => 'Username format is invalid.',
     * 'min_length' => 'Username must be at least {param} characters.',
     * ],
     * 'password' => [
     * 'password' => 'Password must be strong enough.',
     * ],
     * '*' => [
     * 'required' => '{field} cannot be empty.',
     * ],
     * ];
     *
     * $result = $validator->validate($this->request->getBody(), $rules, $messages, true);
     *
     * if (! $result['valid']) {
     * return $this->response->setStatusCode(400)->setJSON($result);
     * }
     * ```
     * @param bool $decodeJson
     *   If true, $input is decoded as JSON first.
     *
     * @return array{
     *   valid: bool,
     *   errors: array<string, array<int, string>>,
     *   data: array|null
     * }
     */
    public function validate(string|array $input, array $rules, array $messages = [], bool $decodeJson = false): array
    {
        $errors = [];

        $data = $this->normalizeInput($input, $decodeJson, $errors);
        if ($data === null) {
            return [
                'valid'  => false,
                'errors' => $errors,
                'data'   => null,
            ];
        }

        // Reject unexpected keys.
        $allowedPaths = $this->buildAllowedPaths(array_keys($rules));
        $actualPaths   = $this->collectObjectPaths($data);

        foreach ($actualPaths as $path) {
            if (!isset($allowedPaths[$path])) {
                $this->addError(
                    $errors,
                    $path,
                    $this->resolveMessage($path, 'unexpected', null, null, $messages)
                );
            }
        }

        // Validate expected fields.
        foreach ($rules as $field => $ruleString) {
            $ruleList = array_values(array_filter(array_map('trim', explode('|', (string) $ruleString))));

            $isRequired = in_array('required', $ruleList, true);
            $isNullable = in_array('nullable', $ruleList, true);

            [$exists, $value] = $this->getPathValue($data, $field);

            if (!$exists) {
                if ($isRequired) {
                    $this->addError(
                        $errors,
                        $field,
                        $this->resolveMessage($field, 'required', null, null, $messages)
                    );
                }
                continue;
            }

            if ($value === null) {
                if ($isNullable) {
                    continue;
                }

                $this->addError(
                    $errors,
                    $field,
                    $this->resolveMessage($field, 'nullable', null, null, $messages)
                );
                continue;
            }

            if ($isRequired && $this->isEmptyValue($value)) {
                $this->addError(
                    $errors,
                    $field,
                    $this->resolveMessage($field, 'required', null, $value, $messages)
                );
                continue;
            }

            foreach ($ruleList as $rule) {
                if ($rule === 'required' || $rule === 'nullable') {
                    continue;
                }

                [$ruleName, $param] = $this->parseRule($rule);

                switch ($ruleName) {
                    case 'string':
                        if (!is_string($value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'int':
                    case 'integer':
                        if (!is_int($value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'float':
                    case 'double':
                        if (!is_float($value) && !is_int($value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'bool':
                    case 'boolean':
                        if (!is_bool($value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'array':
                        if (!is_array($value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'numeric':
                        if (!is_numeric($value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'email':
                        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'url':
                        if (!filter_var($value, FILTER_VALIDATE_URL)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'ip':
                        if (!filter_var($value, FILTER_VALIDATE_IP)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'uuid':
                        if (!$this->isUuid((string) $value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'alpha':
                        if (!is_string($value) || !preg_match('/^[a-zA-Z]+$/', $value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'alpha_numeric':
                        if (!is_string($value) || !preg_match('/^[a-zA-Z0-9]+$/', $value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'alpha_dash':
                        if (!is_string($value) || !preg_match('/^[a-zA-Z0-9_-]+$/', $value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'username':
                        if (!$this->isValidUsername((string) $value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'password':
                        if (!$this->isValidPassword((string) $value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'min_length':
                        if (!$this->passesMinLength($value, (int) $param)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'max_length':
                        if (!$this->passesMaxLength($value, (int) $param)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'min':
                        if (!is_numeric($value) || (float) $value < (float) $param) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'max':
                        if (!is_numeric($value) || (float) $value > (float) $param) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'in':
                        $allowed = array_map('trim', explode(',', (string) $param));
                        if (!in_array((string) $value, $allowed, true)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    case 'same':
                        [$otherExists, $otherValue] = $this->getPathValue($data, (string) $param);

                        if (!$otherExists) {
                            $this->addError(
                                $errors,
                                $field,
                                $this->resolveMessage($field, $ruleName, $param, $value, $messages)
                            );
                            break;
                        }

                        if ($value !== $otherValue) {
                            $this->addError(
                                $errors,
                                $field,
                                $this->resolveMessage($field, $ruleName, $param, $value, $messages)
                            );
                        }
                        break;

                    case 'regex':
                        if (!is_scalar($value)) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                            break;
                        }

                        $pattern = (string) $param;
                        $result = @preg_match($pattern, (string) $value);

                        if ($result !== 1) {
                            $this->addError($errors, $field, $this->resolveMessage($field, $ruleName, $param, $value, $messages));
                        }
                        break;

                    default:
                        $this->addError(
                            $errors,
                            $field,
                            $this->resolveMessage($field, 'unknown_rule', $ruleName, $value, $messages)
                        );
                        break;
                }
            }
        }

        return [
            'valid'  => empty($errors),
            'errors' => $errors,
            'data'   => empty($errors) ? $data : null,
        ];
    }

    /**
     * Decode input when requested and normalize it into an associative array.
     *
     * @param string|array $input
     * @param bool $decodeJson
     * @param array<string, array<int, string>> $errors
     * @return array|null
     */
    protected function normalizeInput(string|array $input, bool $decodeJson, array &$errors): ?array
    {
        $data = $input;

        if ($decodeJson) {
            try {
                $data = json_decode((string) $input, true, 512, JSON_THROW_ON_ERROR);
            } catch (JsonException) {
                $errors['_global'][] = $this->defaultMessages['invalid_json'];
                return null;
            }
        }

        if (!is_array($data)) {
            $errors['_global'][] = $this->defaultMessages['invalid_data'];
            return null;
        }

        return $data;
    }

    /**
     * Resolve a validation message using custom messages first, then defaults.
     *
     * Resolution order:
     * 1. messages[field][rule]
     * 2. messages[field]['*']
     * 3. messages['*'][rule]
     * 4. messages['*']['*']
     * 5. defaultMessages[rule]
     * 6. fallback generic message
     *
     * @param string $field
     * @param string $rule
     * @param string|null $param
     * @param mixed $value
     * @param array<string, array<string, string>> $messages
     * @return string
     */
    protected function resolveMessage(
        string $field,
        string $rule,
        ?string $param = null,
        mixed $value = null,
        array $messages = []
    ): string {
        $message = $messages[$field][$rule]
            ?? $messages[$field]['*']
            ?? $messages['*'][$rule]
            ?? $messages['*']['*']
            ?? $this->defaultMessages[$rule]
            ?? 'Validation failed for {field}.';

        return strtr($message, [
            '{field}' => $field,
            '{rule}'  => $rule,
            '{param}' => (string) $param,
            '{value}' => is_scalar($value) ? (string) $value : json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
    }

    /**
     * Add an error message to the error bucket.
     *
     * @param array<string, array<int, string>> $errors
     */
    protected function addError(array &$errors, string $field, string $message): void
    {
        $errors[$field][] = $message;
    }

    /**
     * Parse a rule string into [name, parameter].
     *
     * Example:
     * - min_length[3] => ['min_length', '3']
     * - same[profile.email] => ['same', 'profile.email']
     *
     * @param string $rule
     * @return array{0: string, 1: string|null}
     */
    protected function parseRule(string $rule): array
    {
        if (preg_match('/^([a-zA-Z_]+)\[(.*)\]$/', $rule, $matches)) {
            return [$matches[1], $matches[2]];
        }

        return [$rule, null];
    }

    /**
     * Determine whether a value should count as empty for required validation.
     *
     * @param mixed $value
     * @return bool
     */
    protected function isEmptyValue(mixed $value): bool
    {
        return $value === '' || $value === [];
    }

    /**
     * Build allowed paths from rule fields, including parent prefixes.
     *
     * Example:
     * - profile.email
     * - profile.name
     *
     * Produces:
     * - profile
     * - profile.email
     * - profile.name
     *
     * @param array<int, string> $fields
     * @return array<string, true>
     */
    protected function buildAllowedPaths(array $fields): array
    {
        $allowed = [];

        foreach ($fields as $field) {
            $segments = explode('.', $field);
            $path = '';

            foreach ($segments as $segment) {
                $path = $path === '' ? $segment : $path . '.' . $segment;
                $allowed[$path] = true;
            }
        }

        return $allowed;
    }

    /**
     * Collect associative array paths in dot notation.
     *
     * Sequential arrays are treated as list values and not expanded into numeric keys,
     * which avoids false unexpected-field errors for normal JSON arrays.
     *
     * @param array<string|int, mixed> $data
     * @param string $prefix
     * @return array<int, string>
     */
    protected function collectObjectPaths(array $data, string $prefix = ''): array
    {
        $paths = [];

        foreach ($data as $key => $value) {
            $path = $prefix === '' ? (string) $key : $prefix . '.' . (string) $key;
            $paths[] = $path;

            if (is_array($value) && !$this->isListArray($value)) {
                $paths = array_merge($paths, $this->collectObjectPaths($value, $path));
            }
        }

        return $paths;
    }

    /**
     * Get a nested value using dot notation.
     *
     * @param array<string|int, mixed> $data
     * @param string $path
     * @return array{0: bool, 1: mixed}
     */
    protected function getPathValue(array $data, string $path): array
    {
        $segments = explode('.', $path);
        $current = $data;

        foreach ($segments as $segment) {
            if (!is_array($current) || !array_key_exists($segment, $current)) {
                return [false, null];
            }

            $current = $current[$segment];
        }

        return [true, $current];
    }

    /**
     * Validate username.
     *
     * Rules:
     * - 3 to 30 characters
     * - starts with a letter or number
     * - contains only letters, numbers, underscore, dot, or dash
     *
     * @param string $username
     * @return bool
     */
    public function isValidUsername(string $username): bool
    {
        return (bool) preg_match('/^[a-zA-Z0-9][a-zA-Z0-9_.-]{2,29}$/', $username);
    }

    /**
     * Validate password.
     *
     * Rules:
     * - 8 to 128 characters
     * - at least one lowercase letter
     * - at least one uppercase letter
     * - at least one number
     * - at least one special character
     *
     * @param string $password
     * @return bool
     */
    public function isValidPassword(string $password): bool
    {
        $length = mb_strlen($password);

        if ($length < 8 || $length > 128) {
            return false;
        }

        if (!preg_match('/[a-z]/', $password)) {
            return false;
        }

        if (!preg_match('/[A-Z]/', $password)) {
            return false;
        }

        if (!preg_match('/[0-9]/', $password)) {
            return false;
        }

        if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
            return false;
        }

        return true;
    }

    /**
     * Check whether a value passes minimum length validation.
     *
     * Arrays use count(); strings use mb_strlen(); scalars are cast to string.
     *
     * @param mixed $value
     * @param int $min
     * @return bool
     */
    protected function passesMinLength(mixed $value, int $min): bool
    {
        $length = $this->valueLength($value);

        return $length !== null && $length >= $min;
    }

    /**
     * Check whether a value passes maximum length validation.
     *
     * Arrays use count(); strings use mb_strlen(); scalars are cast to string.
     *
     * @param mixed $value
     * @param int $max
     * @return bool
     */
    protected function passesMaxLength(mixed $value, int $max): bool
    {
        $length = $this->valueLength($value);

        return $length !== null && $length <= $max;
    }

    /**
     * Get the "length" of a value.
     *
     * @param mixed $value
     * @return int|null
     */
    protected function valueLength(mixed $value): ?int
    {
        if (is_array($value)) {
            return count($value);
        }

        if (is_string($value) || is_numeric($value) || is_bool($value)) {
            return mb_strlen((string) $value);
        }

        return null;
    }

    /**
     * Check whether a string is a valid UUID.
     *
     * @param string $value
     * @return bool
     */
    protected function isUuid(string $value): bool
    {
        return (bool) preg_match(
            '/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/',
            $value
        );
    }

    /**
     * Determine whether an array is a list.
     *
     * PHP 8.1 has array_is_list(), but this keeps the class portable.
     *
     * @param array<mixed> $array
     * @return bool
     */
    protected function isListArray(array $array): bool
    {
        $expected = 0;

        foreach ($array as $key => $_value) {
            if ($key !== $expected) {
                return false;
            }
            $expected++;
        }

        return true;
    }
}
