const xlsx = require('xlsx');
const Income = require('../models/Income');
//Add Income Source 
exports.addIncome = async(req, res) => {
  const userId = req.user.id;

  try{
    const {icon,source,amount,date} = req.body;

    //Validation: Check for missing fields
    if(!source || !amount || !date){
      return res.status(400).json({message: "All fields are required"});
    }
    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date)
    });
    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error){
    res.status(500).json({message: "Server Error"});
  }
}

// Get All Income Source 
exports.getAllIncome = async(req, res) => {
  try {
    console.log('Request user:', req.user); // Check if user exists
    const userId = req.user.id;
    console.log('User ID:', userId);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log('Fetching income for user:', userId);
    
    const income = await Income.find({ userId }).sort({ date: -1 });
    console.log('Income found:', income);
    
    res.json(income);
  } catch (error) {
    console.error('Get Income Full Error:', error);
    console.error('Error Stack:', error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Delete Income Source 
exports.deleteIncome = async(req, res) => {
try{
  await Income.findByIdAndDelete(req.params.id);
  res.json({message: "Income deleted successfully"});

}
catch(error){
  res.status(500).json({message:"Server Error"});

}
};

//Download Excel Source 
exports.downloadIncomeExcel = async(req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split('T')[0], // Format date nicely
    }));

    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

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
