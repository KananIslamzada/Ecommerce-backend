const Joi = require("joi");

const Str = Joi.string();
const Num = Joi.number();
const Uri = Joi.string().uri();
const Email = Joi.string().email();
const Bool = Joi.boolean();
const IsoDate = Str.isoDate();
const Arr = Joi.array();

const categorySchema = Joi.object({
  name: Str.required(),
  bgColor: Str.max(7).required(),
  image: Uri.required(),
});

const loginSchema = Joi.object({
  email: Email.required(),
  password: Str.required(),
});

const userSchema = Joi.object({
  username: Str.min(6).required(),
  password: Str.min(6).required(),
  email: Email.required(),
});

const resetSchema = Joi.object({
  password: Str.min(6).required(),
  rePassword: Str.min(6).valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match!",
  }),
  email: Email.required(),
});

const reviewSchema = Joi.object({
  username: Str.required(),
  starCount: Num.max(5).required(),
  profileImage: Uri.required(),
  review: Str.required(),
  productId: Str.required(),
  userId: Str.required(),
});

const deleteReviewSchema = Joi.object({
  reviewId: Str.required(),
  userId: Str.required(),
});

const productSchema = Joi.object({
  isSale: Bool.required(),
  name: Str.required(),
  description: Str.required(),
  salePrice: Str.when("isSale", {
    is: Joi.any().valid(false),
    then: Joi.optional().allow(null, ""),
    otherwise: Joi.required(),
  }),
  price: Str.required(),
  stockCount: Num.required(),
  coverPhoto: Uri.required(),
  photos: Joi.array()
    .min(1)
    .items(
      Joi.object().keys({
        image: Uri.required(),
      })
    )
    .required(),
  store: Str.required(),
  category: Str.required(),
});

const storeSchema = Joi.object({
  name: Str.min(6).required(),
  followers: Num,
  isOfficial: Bool,
  joined: IsoDate,
  location: Str.required(),
  photo: Uri.required(),
});

const wishlistSchema = Joi.object({
  product: Str.required(),
  userId: Str.required(),
});

const sendWishSchema = Joi.object({
  wishlist: Arr.items(Str),
  userId: Str.required(),
});

const deleteWishlistSchema = Joi.object({
  productId: Str.required(),
  userId: Str.required(),
});

const updateProfileSchema = Joi.object({
  email: Email,
  username: Str.min(6),
  userId: Str.required(),
});

const addToCardSchema = Joi.object({
  products: Joi.object().keys({
    product: Str.required(),
    count: Num.min(1).required()
  }).required(),
  userId: Str.required(),
});

const deleteProductFromCardSchema = Joi.object({
  productId: Str.required(),
  userId: Str.required(),
});

const sendCardsSchema = Joi.object({
  products: Arr.items(Joi.object().keys({
    product: Str.required(),
    count: Num.min(1).required()
  })),
  userId: Str.required(),
});

const sendCheckoutSchema = Joi.object({
  userId: Str.required(),
  products: Arr.items(
    Joi.object({
      count: Num.min(1).required(),
      productId: Str.required(),
    }).required()
  )
    .min(1)
    .required(),
});

const updatePasswordSchema = Joi.object({
  oldPassword: Str.min(6).required(),
  password: Str.min(6).required(),
  passwordAgain: Str.min(6).valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match!",
  }),
  userId: Str.required()
})

const validateAsync = async (schema, value) =>
  await schema.validateAsync(value);

const validate = (schema, value) => schema.validate(value);

module.exports = {
  Str,
  Num,
  Uri,
  Email,
  Bool,
  IsoDate,
  Arr,
  categorySchema,
  loginSchema,
  userSchema,
  resetSchema,
  reviewSchema,
  deleteReviewSchema,
  productSchema,
  storeSchema,
  wishlistSchema,
  sendWishSchema,
  deleteWishlistSchema,
  updateProfileSchema,
  addToCardSchema,
  deleteProductFromCardSchema,
  sendCardsSchema,
  sendCheckoutSchema,
  updatePasswordSchema,
  validateAsync,
  validate,
};
