<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUserTableMigration extends Migration
{
    public function up()
    {
        $this->forge->addField([
            "id" => [
                "type" => "INT",
                "unsigned" => true,
                "auto_increment" => true,
            ],
            "name" => [
                "type" => "VARCHAR",
                "constraint" => 100,
                "null" => false
            ],
            "email" => [
                "type" => "VARCHAR",
                "constraint" => 150,
                "null" => false,
                "unique" => true,
            ],
            "password" => [
                "type" => "VARCHAR",
                "constraint" => 255,
                "null" => false,
            ],
            "role" => [
                "type" => "ENUM",
                "constraint" => "'platform_admin', 'school_admin', 'lecturer', 'finance', 'librarian', 'student', 'applicant'",
                "default" => "student"
            ],
            "phone" => [
                "type" => "VARCHAR",
                "null" => true,
                "constraint" => 20,
            ],
            "image" => [
                "type" => "VARCHAR",
                "constraint" => 255,
                "null" => true,
            ],
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
            "updated_at" => [
                "type" => "DATETIME",
                "null" => true,
            ]
        ]);

        $this->forge->addPrimaryKey("id");
        $this->forge->createTable("users");
    }

    public function down()
    {
        $this->forge->dropTable("users");
    }
}
