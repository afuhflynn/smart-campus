<?php

namespace App\Controllers\Api;

use App\Libraries\ApiRequestValidator;
use App\Libraries\GetSession;
use App\Models\SchoolsModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class SchoolController extends ResourceController
{
  protected $format = "json";
    protected $schoolsModel;
    protected $requestValidator;
    public function __construct()
    {
        $this->schoolsModel = new SchoolsModel();
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
}
