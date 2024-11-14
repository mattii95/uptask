<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Validation\Rules\Password as PasswordRules;

class AuthController extends Controller
{
    public function register(RegisterRequest $request) {
        $data = $request->validated();

        // Crear token 6 digits
        $code = rand(100000, 999999);

        // Crear user
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'two_factor_code' => $code,
            'two_factor_expires_at' => now()->addMinutes(15),
        ]);

        // Datos para el email
        $data = [
            'title' => 'Código de Verificación 2FA',
            'content' => 'Tu código de verificación es: ' . $user->two_factor_code . '. El código expirará en 15 minutos.',
            'url' => env('FRONTEND_URL', 'localhost') . '/auth/confirm-account',
            'btnValue' => 'Confirmar Cuenta'
        ];

        // Enviar el email
        Mail::send('emails.layout', $data, function ($message) use ($user) {
            $message->to($user->email, $user->name)
                    ->from('no-reply@uptask.com', 'UpTask')
                    ->subject('Código de Verificación 2FA');
        });

        return response()->json('User registered successfully, check your email!');
    }

    public function verify2FACode(Request $request) {
        $validate = $request->validate([
            'two_factor_code' => 'required|numeric'
        ]);

        $user = User::where('two_factor_code', $validate['two_factor_code'])->first();

        if (!$user) {
            return response()->json(['error' => 'Invalid 2FA code'], 400);
        }

        if (now()->greaterThan($user->two_factor_expires_at)) {
            return response()->json(['error' => '2FA code has expired'], 400);
        }

        $success = User::where('id', $user->id)->update([
            'two_factor_code' => null,
            'two_factor_expires_at' => null,
            'two_factor_confirmate' => true,
        ]);
    
        if (!$success) {
            return response()->json(['error' => 'Failed to update 2FA columns'], 500);
        }

        return response()->json('Your account was successfully confirmed');
    }
    
    public function login(LoginRequest $request) {
        if (Auth::attempt($request->validated())) {
            $user = Auth::user();

            // Verificar si el usuario tiene 2FA activado
            if ($user->two_factor_code && !$user->two_factor_confirmate) {
                $code = rand(100000, 999999);
                User::where('id', $user->id)->update([
                    'two_factor_code' => $code,
                    'two_factor_expires_at' => now()->addMinutes(15),
                ]);

                // Datos para el email
                $data = [
                    'title' => 'Código de Verificación 2FA',
                    'content' => 'Tu código de verificación es: ' . $code . '. El código expirará en 15 minutos.',
                    'url' => env('FRONTEND_URL', 'localhost') . '/auth/confirm-account',
                    'btnValue' => 'Confirmar Cuenta'
                ];

                // Enviar el email
                Mail::send('emails.layout', $data, function ($message) use ($user) {
                    $message->to($user->email, $user->name)
                            ->from('no-reply@uptask.com', 'UpTask')
                            ->subject('Código de Verificación 2FA');
                });
                return response()->json(['error' => 'La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmacion'], 403);
            }

            // Revisar password
            if (Hash::check($request->password, $user->password)) {
                response()->json(['error' => 'Invalid credentials'], 401);
            }

            // Genera el Token
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'type' => 'Bearer'
            ]);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function requestCofirmationCode(Request $request) {
        $validate = $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::firstWhere('email', $request->email);

        if (!$user) {
            return response()->json(['error' => 'La cuenta no esta registrada'], 400);
        }


        if ($user->two_factor_confirmate) {
            return response()->json(['error' => 'La cuenta se encuentra registrada'], 403);
        }

        $code = rand(100000, 999999);

        User::where('email', $request->email)->update([
            'two_factor_code' => $code,
            'two_factor_expires_at' => now()->addMinutes(15),
        ]);

        // Datos para el email
        $data = [
            'title' => 'Código de Verificación 2FA',
            'content' => 'Tu código de verificación es: ' . $code . '. El código expirará en 15 minutos.',
            'url' => env('FRONTEND_URL', 'localhost') . '/auth/confirm-account',
            'btnValue' => 'Confirmar Cuenta'
        ];

        // Enviar el email
        Mail::send('emails.layout', $data, function ($message) use ($user) {
            $message->to($user->email, $user->name)
                    ->from('no-reply@uptask.com', 'UpTask')
                    ->subject('Código de Verificación 2FA');
        });

        return response()->json('Check your email!');

    }

    public function forgotPassword(Request $request) {
        $validate = $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::firstWhere('email', $request->email);

        if (!$user) {
            return response()->json(['error' => 'La cuenta no esta registrada'], 400);
        }

        $code = rand(100000, 999999);

        User::where('email', $request->email)->update([
            'two_factor_code' => $code,
            'two_factor_expires_at' => now()->addMinutes(15),
            'two_factor_confirmate' => false,
        ]);

        // Datos para el email
        $data = [
            'title' => 'Reestablece tu contraseña',
            'content' => 'Tu código de verificación es: ' . $code . '. El código expirará en 15 minutos.',
            'url' => env('FRONTEND_URL', 'localhost') . '/auth/new-password',
            'btnValue' => 'Reestablecer Password'
        ];

        // Enviar el email
        Mail::send('emails.layout', $data, function ($message) use ($user) {
            $message->to($user->email, $user->name)
                    ->from('no-reply@uptask.com', 'UpTask')
                    ->subject('Reestablece tu contraseña');
        });

        return response()->json('Check your email!');

    }

    public function validate2FACode(Request $request) {
        $validate = $request->validate([
            'two_factor_code' => 'required|numeric'
        ]);

        $user = User::where('two_factor_code', $validate['two_factor_code'])->first();

        if (!$user) {
            return response()->json(['error' => 'Invalid 2FA code'], 400);
        }

        if (now()->greaterThan($user->two_factor_expires_at)) {
            return response()->json(['error' => '2FA code has expired'], 400);
        }

        return response()->json('Token Valido, define tu nuevo password');
    }

    public function updatePassword(Request $request, string $token) {
        $validate = $request->validate([
            'password' => [
                'required',
                'confirmed',
                PasswordRules::min(8)->letters()->symbols()->numbers()
            ]
        ]);

        $user = User::where('two_factor_code', $token)->first();

        if (!$user) {
            return response()->json(['error' => 'La cuenta no esta registrada'], 400);
        }

        $code = rand(100000, 999999);

        User::where('id', $user->id)->update([
            'two_factor_code' => $code,
            'two_factor_expires_at' => now()->addMinutes(15),
            'password' => bcrypt($data['password']), 
        ]);

        // Datos para el email
        $data = [
            'title' => 'Código de Verificación 2FA',
            'content' => 'Tu código de verificación es: ' . $code . '. El código expirará en 15 minutos.',
            'url' => env('FRONTEND_URL', 'localhost') . '/auth/confirm-account',
            'btnValue' => 'Confirmar Cuenta'
        ];

        // Enviar el email
        Mail::send('emails.layout', $data, function ($message) use ($user) {
            $message->to($user->email, $user->name)
                    ->from('no-reply@uptask.com', 'UpTask')
                    ->subject('Código de Verificación 2FA');
        });

        return response()->json('Check your email!');

    }
    
    public function logout(Request $request) {
    }
}
