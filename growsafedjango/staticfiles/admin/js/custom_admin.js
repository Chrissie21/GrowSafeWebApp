document.addEventListener("DOMContentLoaded", function () {
  // Confirmation for transaction actions
  const actionForms = document.querySelectorAll(
    'form[action*="/admin/accounts/transaction/"]',
  );
  actionForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const action = form.querySelector('select[name="action"]').value;
      if (
        action === "approve_transactions" ||
        action === "decline_transactions"
      ) {
        if (
          !confirm(
            `Are you sure you want to ${action.replace("_transactions", "")} the selected transactions?`,
          )
        ) {
          e.preventDefault();
        }
      }
    });
  });
});
