import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginStyles } from "../assets/dummyStyles";

const BASE_URL = "http://localhost:4000/api";

const Login = ({ onLogin }) => {
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setLoading(true);
		try {
			const response = await axios.post(`${BASE_URL}/users/login`, form);
			const { token, user } = response.data;
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
			onLogin?.(user, token);
			navigate("/");
		} catch (err) {
			setError(err?.response?.data?.message || "Login failed. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={loginStyles.pageContainer}>
			<div className={loginStyles.cardContainer}>
				<div className={loginStyles.header}>
					<div className={loginStyles.avatar}>
						<Lock className="text-white" />
					</div>
					<h1 className={loginStyles.headerTitle}>Welcome back</h1>
					<p className={loginStyles.headerSubtitle}>Sign in to continue</p>
				</div>

				<div className={loginStyles.formContainer}>
					{error && (
						<div className={loginStyles.errorContainer}>
							<div className={loginStyles.errorIcon}>!</div>
							<p className={loginStyles.errorText}>{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit}>
						<label className={loginStyles.label}>Email Address</label>
						<div className={loginStyles.inputContainer}>
							<span className={loginStyles.inputIcon}>
								<Mail size={18} />
							</span>
							<input
								name="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								placeholder="you@email.com"
								className={loginStyles.input}
							/>
						</div>

						<label className={`${loginStyles.label} mt-4`}>Password</label>
						<div className={loginStyles.inputContainer}>
							<span className={loginStyles.inputIcon}>
								<Lock size={18} />
							</span>
							<input
								name="password"
								type={showPassword ? "text" : "password"}
								value={form.password}
								onChange={handleChange}
								placeholder="••••••••"
								className={loginStyles.passwordInput}
							/>
							<button
								type="button"
								className={loginStyles.passwordToggle}
								onClick={() => setShowPassword((prev) => !prev)}
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>

						<div className={loginStyles.checkboxContainer}>
							<input id="remember" type="checkbox" className={loginStyles.checkbox} />
							<label htmlFor="remember" className={loginStyles.checkboxLabel}>
								Remember me
							</label>
						</div>

						<button
							type="submit"
							className={`${loginStyles.button} ${loading ? loginStyles.buttonDisabled : ""}`}
							disabled={loading}
						>
							{loading && <span className={loginStyles.spinner}></span>}
							Sign in
						</button>
					</form>

					<div className={loginStyles.signUpContainer}>
						<span className={loginStyles.signUpText}>Don't have an account?</span>{" "}
						<Link className={loginStyles.signUpLink} to="/signup">
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
