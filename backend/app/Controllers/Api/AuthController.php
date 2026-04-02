<?php

namespace App\Controllers\Api;

use App\Libraries\ApiRequestValidator;
use App\Libraries\GetSession;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UsersModel;
use Firebase\JWT\JWT;

class AuthController extends ResourceController
{
    protected $format = "json";
    protected $usersModel;
    protected $requestValidator;
    public function __construct()
    {
        $this->usersModel = new UsersModel();
        $this->requestValidator = new ApiRequestValidator();
    }

    public function signup()
    {
        $rules = [
            "name" => "required|min_length[2]|max_length[100]|string",
            "email" => "required|email|max_length[150]",
            "password" => "required|password|max_length[30]",
            "phone" => "nullable|string|max_length[20]|min_length[8]",
            "image" => "nullable|string|max_length[255]min_length[2]",
        ];

        $validationResult = $this->requestValidator->validate($this->request->getBody(), $rules, decodeJson: true);

        if (!$validationResult['valid']) {

            return $this->respond([
                "errors" => $validationResult["errors"],
                "success" => false,
                "error" => "Account signup failed"
                ], 400);
        }

        $data = $validationResult['data'];

        // check if author alread exists
        $foundAuthor = $this->usersModel->where("email", $data["email"])->first();
        if($foundAuthor){
            return $this->respond([
                "error" => "User with this email already exist. Login instead",
                "success" => false,
            ], 409);
        }

        $pwdHash = password_hash($data["password"], PASSWORD_DEFAULT);
        $data = [...$data, "password" => $pwdHash];

        $user = $this->usersModel->save($data);

        if(!$user) return $this->respond([
            "error" => "signup failed",
            "success" => false
        ], 500);

        return $this->respond([
            "message" => "Signup successful",
            "success" => true,
        ], 201);
    }

    public function login()
    {
         $rules = [
            "email" => "required|email|max_length[100]",
            "password" => "required|password|max_length[30]",
        ];

        $validationResult = $this->requestValidator->validate($this->request->getBody(), $rules, decodeJson: true);

        if (!$validationResult['valid']) {

            return $this->respond([
                "errors" => $validationResult["errors"],
                "success" => false,
                "error" => "Sign in failed"
                ], 400);
        }

        $data = $validationResult["data"];

        // Get user by email
        $user = $this->usersModel->where("email", $data["email"])->first();

        if(!$user) return $this->respond([
            "error" => "User not found",
            "success" => false
        ], 404);

        // validate password
        $match = password_verify($data["password"], $user["password"]);

        if(!$match){
            return $this->respond([
                "error" => "Invalid password or email",
                "success" => false,
            ], 403);
        }

        $key = getenv("JWT_KEY");

        $expiresAt = time() + (7 * DAY); // 7 days from now.
        $payload = [
            "iss" => "localhost",
            "aud" => "localhost",
            "iat" => time(),
            "exp" => $expiresAt,
            "user" => [
                "email" => $user["email"],
                "id" => $user["id"]
            ]
        ];

        $token = JWT::encode($payload, $key, "HS256");
        $this->response->setCookie([
           "name" => "jwt",
           "value" => $token,
           "expire" => $expiresAt,
           "httpOnly" => true,
           "samesite" => "lax",
           "secure" => getenv("CI_ENVIRONMENT") == "production"
        ]);

        return $this->respond([
            "message" => "Login successful",
            "success" => true,
            "user" => [...$user, "password" => null]
        ]);

    }

    public function logout()
    {
        $session = GetSession::getSession($this->request);
        $userId = $session["user"]["id"];

        if(!$userId) return $this->respond([
            "error" => "Unauthenticated to logout",
            "success" => false
        ], 401);

        $user = $this->usersModel->find($userId);

        if(!$user)  return $this->respond([
            "error" => "Unauthorized",
            "success" => false
        ], 403);

        $this->response->deleteCookie("jwt");

        return $this->respond([
            "message" => "Logout successful",
            "success" => true,
        ]);
    }

    public function profile()
    {
        $session = GetSession::getSession($this->request);
        $userId = $session["user"]["id"];

        if(!$userId) return $this->respond([
            "error" => "Unauthenticated to logout",
            "success" => false
        ], 401);

         $user = $this->usersModel->find($userId);

        if(!$user)  return $this->respond([
            "error" => "Unauthorized",
            "success" => false
        ], 403);

        return $this->respond([
            "message" => "Profile retreived successfully",
            "success" => true,
            "user" => [...$user, "password" => null]
        ]);
    }
}
