import slugify from "slugify";

export const applySlugify = (schema, sourceField = "name") => {
  schema.pre("save", async function () {
    // If slug is already present and valid, use it
    if (this.slug) {
      this.slug = slugify(this.slug, { lower: true, strict: true });
    }
    // If source field is modified or slug is missing, generate from source
    else if (
      this[sourceField] &&
      (this.isModified(sourceField) || !this.slug)
    ) {
      this.slug = slugify(this[sourceField], { lower: true, strict: true });
    }
    // No need to call next() in async function, just return (or finish).
  });
};
