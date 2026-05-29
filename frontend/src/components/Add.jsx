import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { modalStyles } from "../assets/dummyStyles";

const Add = ({
	isOpen,
	type = "income",
	onClose,
	onSubmit,
	categories,
	initialValues,
	submitLabel
}) => {
	const [form, setForm] = useState({
		description: "",
		amount: "",
		category: "",
		date: "",
	});

	useEffect(() => {
		if (!isOpen) return;
		if (initialValues) {
			setForm({
				description: initialValues.description || "",
				amount: initialValues.amount || "",
				category: initialValues.category || "",
				date: initialValues.date ? String(initialValues.date).slice(0, 10) : "",
			});
			return;
		}
		setForm({ description: "", amount: "", category: "", date: "" });
	}, [isOpen, initialValues]);

	if (!isOpen) return null;

	const palette = type === "expense" ? modalStyles.colorClasses.orange : modalStyles.colorClasses.teal;

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit?.({
			...form,
			amount: form.amount ? Number(form.amount) : 0,
		});
	};

	const categoryOptions = categories?.length
		? categories
		: type === "expense"
			? ["Housing", "Food", "Transport", "Shopping", "Utilities", "Health"]
			: ["Salary", "Freelance", "Investment", "Gift", "Bonus"];

	return (
		<div className={modalStyles.overlay}>
			<div className={modalStyles.modalContainer}>
				<div className={modalStyles.modalHeader}>
					<h3 className={modalStyles.modalTitle}>
						{type === "expense" ? "Add New Expense" : "Add New Income"}
					</h3>
					<button type="button" className={modalStyles.closeButton} onClick={onClose}>
						<X size={18} />
					</button>
				</div>

				<form className={modalStyles.form} onSubmit={handleSubmit}>
					<div>
						<label className={modalStyles.label}>Description</label>
						<input
							name="description"
							value={form.description}
							onChange={handleChange}
							placeholder={type === "expense" ? "Groceries" : "Salary"}
							className={modalStyles.input(palette.ring)}
						/>
					</div>

					<div>
						<label className={modalStyles.label}>Amount</label>
						<input
							name="amount"
							value={form.amount}
							onChange={handleChange}
							type="number"
							placeholder="0"
							className={modalStyles.input(palette.ring)}
						/>
					</div>

					<div>
						<label className={modalStyles.label}>Category</label>
						<select
							name="category"
							value={form.category}
							onChange={handleChange}
							className={modalStyles.input(palette.ring)}
						>
							<option value="">Select category</option>
							{categoryOptions.map((item) => (
								<option key={item} value={item}>
									{item}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className={modalStyles.label}>Date</label>
						<input
							name="date"
							value={form.date}
							onChange={handleChange}
							type="date"
							className={modalStyles.input(palette.ring)}
						/>
					</div>

					<button type="submit" className={modalStyles.submitButton(palette.button)}>
						{submitLabel || (type === "expense" ? "Add Expense" : "Add Income")}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Add;
