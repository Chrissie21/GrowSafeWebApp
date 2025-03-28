class Investment {
  final String name;
  final double amount;
  final double dailyReturnRate; // Percentage (e.g., 0.05 for 5% daily)

  Investment({
    required this.name,
    required this.amount,
    required this.dailyReturnRate,
  });
}

class User {
  final String id;
  final String userId;
  double total;
  double totalDeposit;
  double totalWithdraw;
  List<Investment> investments;
  double dailyEarnings;

  User({
    required this.id,
    required this.userId,
    required this.total,
    required this.totalDeposit,
    required this.totalWithdraw,
    this.investments = const [],
    this.dailyEarnings = 0.0,
  });

  // Simulate daily earnings based on investments
  void calculateDailyEarnings() {
    dailyEarnings = 0.0;
    for (var investment in investments) {
      dailyEarnings += investment.amount * investment.dailyReturnRate;
    }
    total += dailyEarnings;
  }

  // Handle deposit
  void deposit(double amount) {
    total += amount;
    totalDeposit += amount;
  }

  // Handle withdrawal
  bool withdraw(double amount) {
    if (total >= amount) {
      total -= amount;
      totalWithdraw += amount;
      return true;
    }
    return false;
  }
}