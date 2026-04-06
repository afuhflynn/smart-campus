<?php

use App\Controllers\Api\ApplicationController;
use App\Controllers\Api\AuthController;
use App\Controllers\Api\SchoolController;
use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// This helps for cors
$routes->options('(:any)', function () {
    return response()->setStatusCode(200);
});

// Public routes
$routes->group("api", function ($routes) {
  $routes->group("auth", function ($routes) {
    $routes->post("signup", [AuthController::class, "signup"]);
    $routes->post("login", [AuthController::class, "login"]);
  });

  $routes->group("schools", function ($routes){
    $routes->get("/", [SchoolController::class, "list"]);
    $routes->get("profile/(:any)", [SchoolController::class, "showOne"]);
    $routes->post("apply/(:num)", [ApplicationController::class, "apply"]);
  });
});


// Protected routes
$routes->group("api", ["filter" => "auth_filter"], function ($routes) {

   $routes->group("auth", function ($routes) {
    $routes->get("logout", [AuthController::class, "logout"]);
    $routes->get("profile", [AuthController::class, "profile"]);
  });
  $routes->group("schools", function ($routes){
    $routes->post("register", [SchoolController::class, "register"]);
    $routes->get("my-application", [ApplicationController::class, "myApplication"]);
    $routes->get("check-slug", [SchoolController::class, "checkSlug"]);

    $routes->group("admin/(:num)", ["filter" => "school_admin_filter"], function ($routes) {
      $routes->put("form-fields", [ApplicationController::class, "createForm"]);
      $routes->get("applications", [ApplicationController::class, "showApplications"]);
    });
  });
});
