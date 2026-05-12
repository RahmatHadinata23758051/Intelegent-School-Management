<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateFreshSeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:fresh-seed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Drop all tables, run migrations, and seed the database (auto-approve)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Starting fresh migration and seeding...');
        $this->newLine();

        // Drop all tables and migrate
        $this->info('📦 Running migrate:fresh...');
        $this->call('migrate:fresh', ['--force' => true]);
        $this->newLine();

        // Seed database
        $this->info('🌱 Seeding database...');
        $this->call('db:seed', ['--force' => true]);
        $this->newLine();

        $this->info('✅ Database migrated and seeded successfully!');
        $this->newLine();

        // Show demo credentials
        $this->info('🔑 Demo Credentials:');
        $this->table(
            ['Role', 'Email', 'Password'],
            [
                ['Admin', 'admin@isms-ewa.local', 'password'],
                ['Teacher', 'teacher@isms-ewa.local', 'password'],
                ['Homeroom Teacher', 'homeroom@isms-ewa.local', 'password'],
            ]
        );

        return Command::SUCCESS;
    }
}
