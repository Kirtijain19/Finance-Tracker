import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff, Mail, User } from "lucide-react";
import { signupStyles } from "../assets/dummyStyles";

const BASE_URL = "http://localhost:4000/api";

const Signup = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: "", email: "", password: "" });
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
			await axios.post(`${BASE_URL}/users/register`, form);
			navigate("/login");
		} catch (err) {
			setError(err?.response?.data?.message || "Signup failed. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={signupStyles.pageContainer}>
			<div className={signupStyles.cardContainer}>
				<div className={signupStyles.header}>
					<button
						type="button"
						className={signupStyles.backButton}
						onClick={() => navigate("/login")}
					>
						<ArrowLeft size={18} />
					</button>
					<div className={signupStyles.avatar}>
						<User className="text-white" />
					</div>
					<h1 className={signupStyles.headerTitle}>Create Account</h1>
					<p className={signupStyles.headerSubtitle}>Join ExpenseTracker to manage your finances</p>
				</div>

				<div className={signupStyles.formContainer}>
					{error && <p className={signupStyles.apiError}>{error}</p>}
					<form onSubmit={handleSubmit}>
						<label className={signupStyles.label}>Full Name</label>
						<div className={signupStyles.inputContainer}>
							<span className={signupStyles.inputIcon}>
								<User size={18} />
							</span>
							<input
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder="John Doe"
								className={signupStyles.input}
							/>
						</div>

						<label className={`${signupStyles.label} mt-4`}>Email Address</label>
						<div className={signupStyles.inputContainer}>
							<span className={signupStyles.inputIcon}>
								<Mail size={18} />
							</span>
							<input
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder="your@email.com"
								className={signupStyles.input}
							/>
						</div>

						<label className={`${signupStyles.label} mt-4`}>Password</label>
						<div className={signupStyles.inputContainer}>
							<span className={signupStyles.inputIcon}>
								<User size={18} />
							</span>
							<input
								name="password"
								type={showPassword ? "text" : "password"}
								value={form.password}
								onChange={handleChange}
								placeholder="••••••••"
								className={signupStyles.passwordInput}
							/>
							<button
								type="button"
								className={signupStyles.passwordToggle}
								onClick={() => setShowPassword((prev) => !prev)}
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>

						<div className={signupStyles.checkboxContainer}>
							<input id="terms" type="checkbox" className={signupStyles.checkbox} />
							<label htmlFor="terms" className={signupStyles.checkboxLabel}>
								Remember me
							</label>
						</div>

						<button
							type="submit"
							className={`${signupStyles.button} ${loading ? signupStyles.buttonDisabled : ""}`}
							disabled={loading}
						>
							{loading && <span className={signupStyles.spinner}></span>}
							Create Account
						</button>
					</form>

					<div className={signupStyles.signInContainer}>
						<span className={signupStyles.signInText}>Already have an account?</span>{" "}
						<Link className={signupStyles.signInLink} to="/login">
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup;
