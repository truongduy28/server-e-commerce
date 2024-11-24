import SupplierModel from "../models/SupplierModel";

const getSuppliers = async (req: any, res: any) => {
  const { pageSize, page } = req.query;

  try {
    const skip = (page - 1) * pageSize;

    const items = await SupplierModel.find({ isDeleted: false })
      .skip(skip)
      .limit(pageSize);

    const total = await SupplierModel.countDocuments();

    res.status(200).json({
      message: "Products",
      data: {
        total,
        items,
      },
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const addNew = async (req: any, res: any) => {
  const body = req.body;
  try {
    const newSupplier = new SupplierModel(body);
    newSupplier.save();

    res.status(200).json({
      message: "Add new supplier successfully!!!",
      data: newSupplier,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const update = async (req: any, res: any) => {
  const body = req.body;
  const { id } = req.query;
  try {
    await SupplierModel.findByIdAndUpdate(id, body);

    res.status(200).json({
      message: 'Supplier updated',
      data: [],
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const exportToExcel = async (req: any, res: any) => {
  const { startDate, endDate, columns } = req.body;

  try {
    const query: any = {
      isDeleted: false,
      ...(startDate && endDate ? { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {})
    };
    const items = await SupplierModel.find(query).select(columns.join(' '));

    res.status(200).json({
      data: items
    })

  } catch (error: any) {
    console.error('Error generating Excel file:', error); // Log the error for debugging
    res.status(500).json({
      message: 'An error occurred while generating the file.',
      error: error.message,
    });
  }
};


export { addNew, exportToExcel, getSuppliers, update };

