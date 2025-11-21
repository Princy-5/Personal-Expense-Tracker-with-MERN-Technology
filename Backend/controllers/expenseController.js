const xlsx = require('xlsx');
const Expense= require('../models/Expense');

//Add Expense Source 
exports.addExpense = async(req, res) => {
  const userId = req.user.id;

  try{
    const {icon, category,amount,date} = req.body;

    //Validation: Check for missing fields
    if(!category|| !amount || !date){
      return res.status(400).json({message: "All fields are required"});
    }
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date)
    });
    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error){
    res.status(500).json({message: "Server Error"});
  }
}

// Get All Expense Source 
exports.getAllExpense = async(req, res) => {
  try {
    console.log('Request user:', req.user); // Check if user exists
    const userId = req.user.id;
    console.log('User ID:', userId);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log('Fetching Expense for user:', userId);
    
    const expense= await Expense.find({ userId }).sort({ date: -1 });
    console.log('Expense found:', expense);
    
    res.json(expense);
  } catch (error) {
    console.error('Get Expense Full Error:', error);
    console.error('Error Stack:', error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Delete Income Source 
exports.deleteExpense= async(req, res) => {
try{
  await Expense.findByIdAndDelete(req.params.id);
  res.json({message: "Expense deleted successfully"});

}
catch(error){
  res.status(500).json({message:"Server Error"});

}
};

//Download Excel Source 
exports.downloadExpenseExcel = async(req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split('T')[0], // Format date nicely
    }));

    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "expense");

    // Generate buffer instead of writing to file
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=income_details.xlsx');
    
    // Send the file buffer
    res.send(buffer);

  } catch (error) {
    console.error('Download Excel Error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
