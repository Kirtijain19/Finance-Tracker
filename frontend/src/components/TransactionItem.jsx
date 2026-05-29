import React from "react";
import { Edit3, Trash2 } from "lucide-react";
import { transactionItemStyles } from "../assets/dummyStyles";
import { formatCurrency, formatDate } from "./Helpers";

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
	const isExpense = transaction?.type === "expense";
	const colorClasses = isExpense
		? {
				text: "text-orange-600",
				bg: "bg-orange-50",
				border: "border-orange-200",
				ring: "focus:ring-orange-400",
				iconBg: "bg-orange-100 text-orange-600",
			}
		: {
				text: "text-teal-600",
				bg: "bg-teal-50",
				border: "border-teal-200",
				ring: "focus:ring-teal-400",
				iconBg: "bg-teal-100 text-teal-600",
			};

	return (
		<div className={transactionItemStyles.container(false, colorClasses)}>
			<div className={transactionItemStyles.mainContainer}>
				<div className={transactionItemStyles.iconContainer("p-2 rounded-lg", colorClasses)}>
					{isExpense ? "-" : "+"}
				</div>
				<div className={transactionItemStyles.contentContainer}>
					<p className={transactionItemStyles.description}>{transaction?.description}</p>
					<p className={transactionItemStyles.details}>
						{transaction?.category} • {formatDate(transaction?.date)}
					</p>
				</div>
			</div>

			<div className={transactionItemStyles.actionsContainer}>
				<div className={transactionItemStyles.amountContainer}>
					<span className={`${transactionItemStyles.amountText(colorClasses.text, colorClasses)}`}>
						{formatCurrency(transaction?.amount)}
					</span>
				</div>
				{(onEdit || onDelete) && (
					<div className={transactionItemStyles.buttonsContainer}>
						{onEdit && (
							<button type="button" onClick={() => onEdit?.(transaction)} className="p-2 text-gray-500 hover:text-teal-600">
								<Edit3 size={16} />
							</button>
						)}
						{onDelete && (
							<button type="button" onClick={() => onDelete?.(transaction)} className="p-2 text-gray-500 hover:text-red-600">
								<Trash2 size={16} />
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default TransactionItem;
