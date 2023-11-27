import BaseModel from "./BaseModel.js"

class CarouselModel extends BaseModel {
  static tableName = "carousel"

  static get idColumn() {
    return "image_url"
  }
}

export default CarouselModel
