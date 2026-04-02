<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateShcoolAdminsTableMigration extends Migration
{
    public function up()
    {
        $this->forge->addField([
            "id" => [
                "type" => "INT",
                "unsgined" => true,
                "auto_increment" => true,
            ],
            "user_id" => [
                "type" => "INT",
                "unsigned" => true,
                "null" => false
            ],
            "school_id" => [
                "type" => "INT",
                "unsigned" => true,
                "null" => false
            ],
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
        ]);

        $this->forge->addPrimaryKey("id");
        $this->forge->addForeignKey("user_id", "users", "id", "CASCADE", "CASCADE");
        $this->forge->addForeignKey("school_id", "schools", "id", "CASCADE", "CASCADE");
        $this->forge->createTable("school_admins");
    }

    public function down()
    {
        $this->forge->dropTable("school_admins");
    }
}
