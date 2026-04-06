<?php

namespace App\Filters;

use App\Libraries\GetSession;
use App\Models\UsersModel;
use CodeIgniter\Config\Services;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class SchoolAdminFilter implements FilterInterface
{
    protected $usersModel;
    public function __construct()
    {
        $this->usersModel = new UsersModel();
    }
    /**
     * Do whatever processing this filter needs to do.
     * By default it should not return anything during
     * normal execution. However, when an abnormal state
     * is found, it should return an instance of
     * CodeIgniter\HTTP\Response. If it does, script
     * execution will end and that Response will be
     * sent back to the client, allowing for error pages,
     * redirects, etc.
     *
     * @param RequestInterface $request
     * @param array|null       $arguments
     *
     * @return RequestInterface|ResponseInterface|string|void
     */
    public function before(RequestInterface $request, $arguments = null)
    {
         $session = GetSession::getSession($request);
        $userId = $session["user"]["id"];

        if(!$userId)  return Services::response()->setStatusCode(401)->setJSON([
            "success" => false,
            "error" => "Unauthenticated access",
        ]);

        $user = $this->usersModel->find($userId);

        if(!$user)  return Services::response()->setStatusCode(401)->setJSON([
            "success" => false,
            "error" => "Unauthenticated access",
        ]);

        if($user["role"] !== "school_admin") return Services::response()->setStatusCode(403)->setJSON([
            "success" => false,
            "error" => "Unauthorized action"
        ]);
    }

    /**
     * Allows After filters to inspect and modify the response
     * object as needed. This method does not allow any way
     * to stop execution of other after filters, short of
     * throwing an Exception or Error.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     *
     * @return ResponseInterface|void
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
