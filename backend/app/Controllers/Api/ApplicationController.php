<?php

namespace App\Controllers\Api;

use App\Libraries\ApiRequestValidator;
use App\Libraries\GetSession;
use App\Models\ApplicationsModel;
use App\Models\SchoolsModel;
use CodeIgniter\RESTful\ResourceController;

class ApplicationController extends ResourceController
{
    protected $format = "json";
    protected $schoolsModel;
    protected $applicationsModel;
    protected $requestValidator;
    public function __construct()
    {
        $this->schoolsModel = new SchoolsModel();
        $this->requestValidator = new ApiRequestValidator();
        $this->applicationsModel = new ApplicationsModel();
    }
    public function showApplications($id)
    {
        $school = $this->schoolsModel->find($id);

        if(!$school) return $this->respond([
            "error" => "School not found",
            "success" => false,
        ], 404);

        $applications = $this->applicationsModel->where("school_id", $id)->findAll();

        if(!$applications) return $this->respond([
            "error" => "No school applications found",
            "success" => false,
        ], 404);

        return $this->respond([
            "school" => $school,
            "applications" => $applications,
            "success" => true,
        ]);
    }
    public function apply($id)
    {
        $rules = [
            "applicant_user_id" => "int",
            "applicant_name" => "required|min_length[2]|max_length[100]|string",
            "applicant_email" => "required|email|max_length[150]",
            "payload" => "required|array"
        ];

        $validationResult = $this->requestValidator->validate($this->request->getBody(), $rules, decodeJson: true);

         if (!$validationResult['valid']) {
            return $this->respond([
                "errors" => $validationResult["errors"],
                "success" => false,
                "error" => "Invalid application data."
                ], 400);
        }
        $school = $this->schoolsModel->find($id);

        if(!$school) return $this->respond([
            "error" => "School not found",
            "success" => false,
        ], 404);

        $data = $validationResult["data"];
        $data = [
            ...$data,
            "payload" => json_encode($data["payload"][0]),
            "school_id" => $id,
        ];

        $application = $this->applicationsModel->save($data);

        if(!$application) return $this->respond([
            "error" => "Application submission failed",
            "success" => false,
        ], 500);

        return $this->respond([
            "message" => "Application submitted successfully!",
            "success" => true,
        ]);
    }

      public function createForm($schoolId)
    {
        $rules = [
            "registration_fields" => "array|required"
        ];

        $validationResult = $this->requestValidator->validate($this->request->getBody(), $rules, decodeJson: true);

        if (!$validationResult['valid']) {
            return $this->respond([
                "errors" => $validationResult["errors"],
                "success" => false,
                "error" => "Invalid registration form setup."
                ], 400);
        }

        $data = $validationResult["data"];

        $updatedSchool = $this->schoolsModel->update($schoolId, ["registration_fields" => json_encode($data["registration_fields"])]);

        if(!$updatedSchool) return $this->respond([
            "error" => "Failed create school application form",
            "success" => false
        ], 500);

        return $this->respond([
            "message" => "Application form created successfully",
            "success" => true,
        ], 202);
    }

     public function myApplication()
    {
         // create a new school admin with current user
        $session = GetSession::getSession($this->request);
        $userId = $session["user"]["id"];

        if(!$userId) return $this->respond([
            "error" => "Unauthenticated to logout",
            "success" => false
        ], 401);
        $application = $this->applicationsModel->where("applicant_user_id", $userId)->first();

        if(!$application) return $this->respond([
            "error" => "No application submitted yet",
            "success" => false,
        ], 404);

        $school = $this->schoolsModel->find($application["school_id"]);

        return $this->respond([
            "application" => $application,
            "school" => $school,
            "success" => true,
        ]);
    }
}
