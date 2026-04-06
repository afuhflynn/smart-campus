<?php

namespace App\Controllers\Api;

use App\Libraries\ApiRequestValidator;
use App\Libraries\GetSession;
use App\Models\SchoolAdminsModel;
use App\Models\SchoolsModel;
use App\Models\UsersModel;
use CodeIgniter\RESTful\ResourceController;

class SchoolController extends ResourceController
{
    protected $format = "json";
    protected $schoolsModel;
    protected $schoolAdminsModel;
    protected $usersModel;
    protected $requestValidator;
    public function __construct()
    {
        $this->schoolsModel = new SchoolsModel();
        $this->schoolAdminsModel = new SchoolAdminsModel();
        $this->usersModel = new UsersModel();
        $this->requestValidator = new ApiRequestValidator();
    }

    public function list(){
        $page = $this->request->getVar("page") ?? 1;
        $query = $this->request->getVar("q") ?? "";
        $limit = $this->request->getVar("limit") ?? 20;
        $offset = ($page - 1) * $limit;

        $city = $this->request->getVar("city") ?? "";
        $schools = $this->schoolsModel->orLike("name", $query, "both", null, true)->orLike("city", $city, "both", null, true)->orLike("region", $city, "both", null, true)->findAll($limit, $offset);

        if(!$schools) return $this->respond([
            "message" => "No schools found",
            "success" => false,
            "data" => [],
            "pagination" => [
                "page" => $page,
                "limit" => $limit,
                "total" => 0,
                "totalPages" => 0,
            ]
        ], 202);

        $total = count($schools);

        $pagination = [
            "page" => $page,
            "limit" => $limit,
            "total" => $total,
            "totalPages" => floor($total / $limit),
        ];

         return $this->respond([
            "success" => false,
            "data" => $schools,
            "pagination" => $pagination
        ]);
    }

    public function showOne($slug)
    {
        $school = $this->schoolsModel->where("slug", $slug)->first();

        if(!$school) return $this->respond([
            "error" => "School not found",
            "success" => false,
        ], 404);

        return $this->respond([
            "school" => $school,
            "success" => true,
        ]);
    }
    public function register()
    {
        $rules = [
            "name" => "string|min_length[3]|max_length[100]|required",
            "abbreviation" => "string|max_length[100]",
            "school_type" => "required|string",
            "description" => "string|required|max_length[500]",
            "logo_url" => "url",
            "banner_url" => "url",
            "address" => "string|required|min_length[5]|max_length[255]",
            "city" => "string|required|min_length[1]|max_length[100]",
            "region" => "string|required|max_length[100]",
            "country" => "string|required|max_length[100]",
            "phone" => "string|required|min_length[1]|max_length[20]",
            "email" => "required|email",
            "website" => "url",
            "authorization_number" => "required|string|min_length[5]|max_length[255]",
            "issuing_authority" => "required|string|min_length[1]|max_length[255]",
            "authorization_date" => "required",
            "slug" => "required|string|max_length[150]"
        ];

        $validationResult = $this->requestValidator->validate($this->request->getBody(), $rules, decodeJson: true);

         if (!$validationResult['valid']) {
            return $this->respond([
                "errors" => $validationResult["errors"],
                "success" => false,
                "error" => "School registration failed"
                ], 400);
        }

        $data = $validationResult["data"];

        // create the school
        $created = $this->schoolsModel->save($data);

        if(!$created) return $this->respond([
            "error" => "Failed to create school",
            "success" => false,
        ], 500);

        $school = $this->schoolsModel->orderBy("created_at", "asc")->first();

         if(!$school) return $this->respond([
            "error" => "Failed to create school",
            "success" => false,
        ], 500);

        // create a new school admin with current user
        $session = GetSession::getSession($this->request);
        $userId = $session["user"]["id"];

        if(!$userId) return $this->respond([
            "error" => "Unauthenticated to logout",
            "success" => false
        ], 401);

        $adminCreated = $this->schoolAdminsModel->save(["school_id" => $school["id"], "user_id" => $userId]);

        if(!$adminCreated) return $this->respond([
            "error" => "Failed to create school",
            "success" => false,
        ], 500);

        // update user role to school_admin role
        $updatedUser = $this->usersModel->update($userId, ["role" => "school_admin"]);

        if(!$updatedUser) return $this->respond([
            "error" => "Failed to create school",
            "success" => false,
        ], 500);

        return $this->respond([
            "message" => "School created successfully",
            "success" => true,
            "school" => $school
        ], 201);
    }
    public function checkSlug()
    {
        $slug = $this->request->getVar("slug");

         if (!$slug) {
            return $this->respond([
                "success" => false,
                "error" => "A valid school slug must be provided",
                "available" => false,
                "slug" => $slug,
            ], 400);
        }

        $school = $this->schoolsModel->where("slug", $slug)->first();

        if($school) return $this->respond([
            "error" => "School already exists",
            "success" => false,
            "available" => false,
            "slug" => $slug,
        ], 409);

        return $this->respond([
            "success" => true,
            "available" => true,
            "slug" => $slug,
        ], 202);
    }
}
