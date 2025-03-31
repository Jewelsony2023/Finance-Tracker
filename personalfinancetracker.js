document.addEventListener('DOMContentLoaded', function() {
    // Initialize state
    let state = {
        income: [],
        expenses: [],
        budget: {
            monthly: 0,
            savingsGoal: 0
        },
        savings: 0
    };

    // Load data from localStorage
    loadData();

    // Update current date
    updateCurrentDate();

    // Initialize charts
    initializeCharts();

    // Event Listeners
    document.querySelectorAll('nav ul li').forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('nav ul li').forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            // Show corresponding section
            showSection(item.dataset.tab);
        });
    });

    // Income form submission
    document.getElementById('income-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('income-amount').value);
        const category = document.getElementById('income-category').value;
        const date = document.getElementById('income-date').value;

        if (!amount || !date) {
            alert('Please fill in all fields');
            return;
        }

        addIncome(amount, category, date);
        this.reset();
        updateDashboard();
    });

    // Expense form submission
    document.getElementById('expense-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;

        if (!amount || !date) {
            alert('Please fill in all fields');
            return;
        }

        addExpense(amount, category, date);
        this.reset();
        updateDashboard();
    });

    // Budget form submission
    document.getElementById('budget-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const monthlyBudget = parseFloat(document.getElementById('monthly-budget').value);
        const savingsGoal = parseFloat(document.getElementById('savings-goal').value);

        if (!monthlyBudget || !savingsGoal) {
            alert('Please fill in all fields');
            return;
        }

        setBudget(monthlyBudget, savingsGoal);
        this.reset();
        updateDashboard();
    });

    // Functions
    function loadData() {
        const savedData = localStorage.getItem('financeTrackerData');
        if (savedData) {
            state = JSON.parse(savedData);
        }
    }

    function saveData() {
        localStorage.setItem('financeTrackerData', JSON.stringify(state));
    }

    function updateCurrentDate() {
        const date = new Date();
        document.getElementById('current-date').textContent = date.toLocaleDateString();
    }

    function addIncome(amount, category, date) {
        state.income.push({ amount, category, date });
        saveData();
    }

    function addExpense(amount, category, date) {
        state.expenses.push({ amount, category, date });
        saveData();
    }

    function setBudget(monthlyBudget, savingsGoal) {
        state.budget.monthly = monthlyBudget;
        state.budget.savingsGoal = savingsGoal;
        saveData();
    }

    function calculateMonthlyIncome() {
        const currentMonth = new Date().getMonth();
        return state.income
            .filter(item => new Date(item.date).getMonth() === currentMonth)
            .reduce((sum, item) => sum + item.amount, 0);
    }

    function calculateMonthlyExpenses() {
        const currentMonth = new Date().getMonth();
        return state.expenses
            .filter(item => new Date(item.date).getMonth() === currentMonth)
            .reduce((sum, item) => sum + item.amount, 0);
    }

    function calculateTotalBalance() {
        const totalIncome = state.income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = state.expenses.reduce((sum, item) => sum + item.amount, 0);
        return totalIncome - totalExpenses;
    }

    function calculateSavings() {
        const monthlyIncome = calculateMonthlyIncome();
        const monthlyExpenses = calculateMonthlyExpenses();
        const savingsGoal = state.budget.savingsGoal / 100;
        return monthlyIncome * savingsGoal;
    }

    function updateDashboard() {
        // Update balance
        document.getElementById('total-balance').textContent = 
            `$${calculateTotalBalance().toFixed(2)}`;

        // Update monthly income
        document.getElementById('monthly-income').textContent = 
            `$${calculateMonthlyIncome().toFixed(2)}`;

        // Update monthly expenses
        document.getElementById('monthly-expenses').textContent = 
            `$${calculateMonthlyExpenses().toFixed(2)}`;

        // Update savings
        document.getElementById('total-savings').textContent = 
            `$${calculateSavings().toFixed(2)}`;

        // Update charts
        updateCharts();
    }

    function showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        document.getElementById(`${sectionId}-section`).style.display = 'block';
    }

    function initializeCharts() {
        const ctx = document.getElementById('savings-chart').getContext('2d');
        window.savingsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Savings', 'Expenses'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function updateCharts() {
        const monthlyIncome = calculateMonthlyIncome();
        const monthlyExpenses = calculateMonthlyExpenses();
        const savings = calculateSavings();

        window.savingsChart.data.datasets[0].data = [savings, monthlyExpenses];
        window.savingsChart.update();
    }

    // Initial dashboard update
    updateDashboard();
}); 