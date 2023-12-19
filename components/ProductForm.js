import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
}) {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [category, setCategory] = useState(assignedCategory || "");
    const [productProperties, setProductProperties] = useState(
        assignedProperties || {}
    );
    const [price, setPrice] = useState(existingPrice || "");
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    const [error, setError] = useState(null);
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [formChanged, setFormChanged] = useState(false); // Flag to track form changes

    useEffect(() => {
        axios.get("/api/categories").then((result) => {
            setCategories(result.data);
        });
    }, []);

    const handleChange = () => {
        // Set the formChanged flag to true when any form field changes
        setFormChanged(true);
    };

    const saveProduct = async (ev) => {
        ev.preventDefault();

        // Validation: Check if title and price are empty
        if (!title.trim() || !price.toString().trim() || !category.trim()) {
            handleError("Title, Category, and price are required fields.");
            return;
        }

        const data = {
            title,
            description,
            price,
            images,
            category,
            properties: productProperties,
        };
        if (_id) {
            //update
            await axios.put("/api/products", { ...data, _id });
        } else {
            //create
            await axios.post("/api/products", data);
        }
        setGoToProducts(true);

        // Reset the formChanged flag when the form is successfully submitted
        setFormChanged(false);
    };

    if (goToProducts) {
        router.push("/products");
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post("/api/upload", data);
            setImages((oldImages) => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    function setProductProp(propName, value) {
        setProductProperties((prev) => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(
                ({ _id }) => _id === catInfo?.parent?._id
            );
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function deleteImage(index) {
        const imageToDelete = images[index];

        // If the image is already stored in the database (has an _id property)
        if (imageToDelete._id) {
            // Send a request to your backend to delete the image
            axios
                .delete(`/api/images/${imageToDelete._id}`)
                .then(() => {
                    // If deletion is successful, update the state
                    setImages((prevImages) => {
                        const updatedImages = [...prevImages];
                        updatedImages.splice(index, 1);
                        return updatedImages;
                    });
                })
                .catch((error) => {
                    // Handle error if deletion fails
                    console.error("Error deleting image:", error);
                });
        } else {
            // If the image is not yet stored in the database, simply update the state
            setImages((prevImages) => {
                const updatedImages = [...prevImages];
                updatedImages.splice(index, 1);
                return updatedImages;
            });
        }
    }

    // Function to handle errors and display the error message
    function handleError(errorMessage) {
        setError(errorMessage);
        setIsErrorVisible(true);
    }

    // Function to close the error message
    function closeError() {
        setIsErrorVisible(false);
    }

    // Function to handle cancel action
    function cancel() {
        router.push("/products"); // Redirect to the "Products" page
    }

    // Check if we are in edit mode based on the current path
    const isEditMode = router.pathname.includes("/products/edit");

    return (
        <form onSubmit={saveProduct}>
            {formChanged && ( // Display warning message when changes have been made
                <div className="bg-teal-700 border flex-col w-3/5 text-white rounded-lg mb-4 flex items-center justify-center p-2">
                    You have unsaved changes.
                </div>
            )}
            {isErrorVisible && (
                <div className="bg-red-100 border flex-col w-4/5 text-red-800 p-2 rounded-lg mb-4 flex items-center justify-center">
                    {error}
                    <button
                        className="ml-2 mt-3 w-1/5 text-red-600 btn-red"
                        onClick={closeError}
                    >
                        Close
                    </button>
                </div>
            )}
            <label>Product name</label>
            <input
                type="text"
                placeholder="product name"
                value={title}
                onChange={(ev) => {
                    setTitle(ev.target.value);
                    handleChange(); // Track form changes
                }}
            />
            <label>Category</label>
            <select
                value={category}
                onChange={(ev) => {
                    setCategory(ev.target.value);
                    handleChange(); // Track form changes
                }}
            >
                <option value="">Uncategorized</option>
                {categories.length > 0 &&
                    categories.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
            </select>
            {propertiesToFill.length > 0 &&
                propertiesToFill.map((p) => (
                    <div key={p.name} className="">
                        <label>
                            {p.name[0].toUpperCase() + p.name.substring(1)}
                        </label>
                        <div>
                            <select
                                value={productProperties[p.name]}
                                onChange={(ev) => {
                                    setProductProp(p.name, ev.target.value);
                                    handleChange(); // Track form changes
                                }}
                            >
                                {p.values.map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}
                >
                    {!!images?.length &&
                        images.map((link, index) => (
                            <div
                                key={link}
                                className="h-24 bg-teal-600 p-4 shadow-sm flex flex-col gap-1 items-center border border-gray-200 mb-4 mt-2 rounded-md"
                            >
                                <img src={link} alt="" className="rounded-lg" />
                                <button
                                    onClick={() => deleteImage(index)}
                                    className="text-red-100 border bg-teal-600 rounded-md p-1 hover"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex mt-2 flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                    </svg>
                    <div>Add image</div>
                    <input
                        type="file"
                        onChange={uploadImages}
                        className="hidden"
                    />
                </label>
            </div>

            <label>Description</label>
            <textarea
                placeholder="description"
                value={description}
                onChange={(ev) => {
                    setDescription(ev.target.value);
                    handleChange(); // Track form changes
                }}
            />
            <label>Price (in KES)</label>
            <input
                type="number"
                placeholder="price"
                value={price}
                onChange={(ev) => {
                    setPrice(ev.target.value);
                    handleChange(); // Track form changes
                }}
            />
            <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                    Save
                </button>
                <button type="button" onClick={cancel} className="btn-red">
                    Cancel
                </button>
            </div>
        </form>
    );
}
