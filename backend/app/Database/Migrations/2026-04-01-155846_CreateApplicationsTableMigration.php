<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateApplicationsTableMigration extends Migration
{
    public function up()
    {
        $this->forge->addField([
            "id" => [
                "type" => "INT",
                "unsigned" => true,
                "auto_increment" => true,
            ],
            "school_id" => [
                "type" => "INT",
                "unsigned" => true,
                "null" => false
            ],
            "applicant_user_id" => [
                "type" => "INT",
                "unsigned" => true,
                "null" => true
            ],
            "applicant_email" => [
                "type" => "VARCHAR",
                "constraint" => 150,
                "null" => false,
            ],
            "applicant_name" => [
                "type" => "VARCHAR",
                "constraint" => 150,
                "null" => false,
            ],
            "payload" => [
                "type" => "JSON",
                "null" => false,
            ],
            "status" => [
                "type" => "ENUM",
                "constraint" => "'pending', 'under_review', 'approved', 'rejected', 'more_info'",
                "pending" => "pending",
            ],
            "approved_at" => [
                "type" => "DATETIME",
                "null" => true,
            ],
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
            "updated_at" => [
                "type" => "DATETIME",
                "null" => true,
            ]
        ]);

        $this->forge->addPrimaryKey("id");
        $this->forge->addForeignKey("school_id", "shcools", "id", "CASCADE", "CASCADE");
        $this->forge->addForeignKey("applicant_user_id", "shcools", "id", "CASCADE", "CASCADE");
        $this->forge->createTable("applications");
    }

    public function down()
    {
        $this->forge->dropTable("applications");
    }
}
