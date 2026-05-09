<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class EnsureSeeded extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:ensure-seeded';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ensure database is seeded with required data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            // Check if users table exists and has data
            if (!User::exists()) {
                $this->info('Database is empty. Running seeders...');
                $this->call('migrate:fresh', ['--seed' => true]);
                $this->info('✅ Database seeded successfully!');
            } else {
                $this->info('✅ Database already seeded.');
            }
        } catch (\Exception $e) {
            $this->error('Error checking database: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
