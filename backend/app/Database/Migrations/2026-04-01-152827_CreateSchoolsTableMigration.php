<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSchoolsTableMigration extends Migration
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
            "slug" => [
                "type" => "VARCHAR",
                "constraint" => 150,
                "unique" => true,
                "null" => false,
            ],
            "description" => [
                "type" => "TEXT",
                "null" => true,
            ],
            "address" => [
                "type" => "VARCHAR",
                "constraint" => 255,
                "null" => false,
            ],
            "city" => [
                "type" => "VARCHAR",
                "constraint" => 100,
                "null" => false,
            ],
            "region" => [
                "type" => "VARCHAR",
                "constraint" => 100,
                "null" => false,
            ],
            "country" => [
                "type" => "VARCHAR",
                "constraint" => 100,
                "null" => false,
                "default" => "cameroon",
            ],
             "email" => [
                "type" => "VARCHAR",
                "constraint" => 150,
                "null" => true,
                "unique" => true,
            ],
            "phone" => [
                "type" => "VARCHAR",
                "null" => true,
                "constraint" => 20,
            ],
            "logo_url" => [
                "type" => "VARCHAR",
                "constraint" => 255,
                "null" => true,
            ],
            "banner" => [
                "type" => "VARCHAR",
                "constraint" => 255,
                "null" => true,
            ],
            "abbreviation" => [
                "type" => "VARCHAR",
                "constraint" => 100,
                "null" => true,
            ],
            "website" => [
                "type" => "VARCHAR",
                "constraint" => 255,
                "null" => true,
            ],
            "pricing_tier" => [
                "type" => "ENUM",
                "constraint" => "'basic', 'standard', 'premium'",
                "default" => "basic"
            ],
            "registration_fields" => [
                "type" => "JSON",
                "null" => true,
            ],
            "authorization_number" => [
                "type" => "VARCHAR",
                "null" => false,
                "constraint" => 255,
            ],
            "issuing_authority" => [
                "type" => "VARCHAR",
                "null" => false,
                "constraint" => 255,
            ],
            "authorization_date" => [
                "type" => "DATETIME",
                "null" => false,
            ],
            "school_type" => [
                "type" => "ENUM",
                "constraint" => "'public', 'private', 'professional', 'vocational'",
                "default" => "private"
            ],
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
            "updated_at" => [
                "type" => "DATETIME",
                "null" => true,
            ]
        ]);

        $this->forge->addPrimaryKey("id");
        $this->forge->createTable("schools");
    }

    public function down()
    {
        $this->forge->dropTable("schools");
    }
}
