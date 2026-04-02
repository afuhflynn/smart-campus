<?php

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

  $routes->get("schools", [SchoolController::class, "list"]);
  $routes->get("schools/(:alpha)", [SchoolController::class, "show"]);
  $routes->post("schools/(:alpha)/apply", [SchoolController::class, "apply"]);
});


// Protected routes
$routes->group("api", ["filter" => "auth_filter"], function ($routes) {

  $routes->group("", ["filter" => "school_admin_filter"], function ($routes) {

  });

   $routes->group("auth", function ($routes) {
    $routes->get("logout", [AuthController::class, "logout"]);
    $routes->get("profile", [AuthController::class, "profile"]);
  });
});
