import PromotionModel from "../models/PromotionModel";

const addNew = async (req: any, res: any) => {
  const body = req.body;

  try {
    const item = new PromotionModel(body);

    await item.save();

    res.status(200).json({
      message: "Promotion added successfully!!",
      data: item,
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

const getPromotions = async (req: any, res: any) => {
  const { limit } = req.query;

  try {
    const items = await PromotionModel.find({ isDeleted: false }).limit(limit);

    res.status(200).json({
      message: "Get promotions successfully!!",
      data: items,
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

const getPromotion = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const promotion = await PromotionModel.findOne({ _id: id });

    res.status(200).json({
      message: "Get promotion successfully!!",
      data: promotion,
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

const updatePromotion = async (req: any, res: any) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const promotion = await PromotionModel.findOneAndUpdate(
      { _id: id },
      { ...body },
      { new: true }
    );

    res.status(200).json({
      message: "Update promotion successfully!!",
      data: promotion,
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export { addNew, getPromotions, getPromotion, updatePromotion };
