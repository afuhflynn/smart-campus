<?php

namespace App\Database\Seeds;

use App\Models\SchoolAdminsModel;
use App\Models\SchoolsModel;
use CodeIgniter\Database\Seeder;
use Faker\Factory;

class SchoolsSeeder extends Seeder
{
    protected $schoolsModel;
    protected $adminModel;
    public function __construct()
    {
        $this->schoolsModel = new SchoolsModel();
        $this->adminModel = new SchoolAdminsModel();
    }
    public function run()
    {
        $factory = Factory::create();
        for ($i = 0; $i <= 10; $i ++){
            $name = str_replace(".", " ", $factory->firstName);
            $slug = str_replace(" ", "-", $factory->slug);
            print_r($slug, $name);
            $data = [
                "name" => $name . " Academy",
                "slug" => $slug,
                "address" => $factory->streetAddress,
                "city" => $factory->city,
                "region" => $factory->city,
                "country" => $factory->country,
                "email" => $factory->email,
                "logo_url" => $factory->imageUrl,
                "banner" => $factory->imageUrl,
                "abbriviation" => "HITBAMAS",
                "website" => $factory->url,
                "authorization_number" => $factory->streetSuffix,
            ];

            $this->schoolsModel->save($data);
            $school = $this->schoolsModel->orderBy("created_at", "asc")->first();

            $admin = $this->adminModel->save(["school_id" => $school["id"], "user_id" => 1]);

            if(!$admin) echo "Failed to seed school";

        }
    }
}
