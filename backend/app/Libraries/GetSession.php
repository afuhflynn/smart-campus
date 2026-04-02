<?php

declare(strict_types=1);

namespace App\Libraries;
use CodeIgniter\HTTP\RequestInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class GetSession{
/**
 * Gets fetches the server headers and extracts the jwt cookie from it and verifies and returns the user field.
 * @param RequestInterface $request
 *  The current server request body
 *
 * @return array{
 *  user: array,
 *  session: array<exp: int, iat: int, iss: string, aud: string, user: array<email: string, id: int>>
 * }
 */
static public function getSession(RequestInterface $request) {
        $cookies = $_COOKIE;

        if(!$cookies){
            return false;
        }

        $token = $cookies["jwt"];
        $decoded = [];
        try {
          $decoded =  JWT::decode($token, new Key(getenv("JWT_KEY"), "HS256"));
        } catch (\Throwable $th) {
             return false;
        }

        $user = $decoded->user;
        $user = [
            "email" => $user->email,
            "id" => $user->id,
        ];

        return [
          "user" => $user,
          "session" => [
            "exp" => $decoded->exp,
            "iat" => $decoded->iat,
            "iss" => $decoded->iss,
            "aud" => $decoded->aud,
            "user" => $user,
          ],

        ];
}
}
