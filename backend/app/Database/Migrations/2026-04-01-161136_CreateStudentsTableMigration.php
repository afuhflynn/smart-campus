<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;
use CodeIgniter\Database\RawSql;

class CreateStudentsTableMigration extends Migration
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
            "user_id" => [
                "type" => "INT",
                "unsigned" => true,
                "null" => false
            ],
            "application_id" => [
                "type" => "INT",
                "unsigned" => true,
                "null" => false
            ],
            // Student matricule number: e.g - SWE24UH022
            "student_number" => [
                "type" => "VARCHAR",
                "constraint" => 50,
                "null" => true,
            ],
            "programme" => [
                "type" => "VARCHAR",
                "constraint" => 150,
                "null" => true,
            ],
            "level" => [
                "type" => "VARCHAR",
                "constraint" => 150,
                "null" => true,
            ],
            "admission_year" => [
                "type" => "YEAR",
                "default" => new RawSql('(YEAR(CURRENT_DATE))')
            ],
            "status" => [
                "type" => "ENUM",
                "constraint" => "'active', 'suspended', 'graduated', 'withdrawn'",
                "default" => "active"
            ],
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
            "updated_at" => [
                "type" => "DATETIME",
                "null" => true,
            ]
        ]);

        $this->forge->addPrimaryKey("id");
        $this->forge->addForeignKey("school_id", "schools", "id", "CASCADE", "CASCADE");
        $this->forge->addForeignKey("user_id", "schools", "id", "CASCADE", "CASCADE");
        $this->forge->addForeignKey("application_id", "applications", "id", "CASCADE", "CASCADE");
        $this->forge->createTable("students");
    }

    public function down()
    {
        $this->forge->dropTable("students");
    }
}
