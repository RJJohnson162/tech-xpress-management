import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [parentCategory, setParentCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);
    const [isErrorVisible, setIsErrorVisible] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);
    function fetchCategories() {
        axios.get("/api/categories").then((result) => {
            setCategories(result.data);
        });
    }
    async function saveCategory(ev) {
        ev.preventDefault();

        if (!name.trim()){
            handleError("Category Name is a required field!!");
            return;
        }

        const data = {
            name,
            parentCategory,
            properties: properties.map((p) => ({
                name: p.name,
                values: p.values.split(","),
            })),
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put("/api/categories", data);
            setEditedCategory(null);
        } else {
            await axios.post("/api/categories", data);
        }
        setName("");
        setParentCategory("");
        setProperties([]);
        fetchCategories();
    }
    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(","),
            }))
        );
    }
    function deleteCategory(category) {
        swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, Delete!",
            confirmButtonColor: "#d55",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete("/api/categories?_id=" + _id);
                fetchCategories();
            }
        });
    }
    function addProperty() {
        setProperties((prev) => {
            return [...prev, { name: "", values: "" }];
        });
    }
    function handlePropertyNameChange(index, property, newName) {
        setProperties((prev) => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties((prev) => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }
    function removeProperty(indexToRemove) {
        setProperties((prev) => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
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

    return (
        <Layout>
            <h1>Categories</h1>
            {isErrorVisible && (
                <div className="bg-red-100 text-red-800 p-2 rounded-lg mb-4 flex flex-col items-center content-center">
                    {error}
                    <button className="ml-2 text-red-600 btn-red" onClick={closeError}>
                        Close
                    </button>
                </div>
            )}

            <label>
                {editedCategory
                    ? `Edit category ${editedCategory.name}`
                    : "Create new category"}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder={"Category name"}
                        onChange={(ev) => setName(ev.target.value)}
                        value={name}
                    />
                    <select
                        onChange={(ev) => setParentCategory(ev.target.value)}
                        value={parentCategory}
                    >
                        <option value="">No parent category</option>
                        {categories.length > 0 &&
                            categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className="btn-primary text-sm mb-2"
                    >
                        Add new property
                    </button>
                    {properties.length > 0 &&
                        properties.map((property, index) => (
                            <div
                                key={property.name}
                                className="flex gap-1 mb-2"
                            >
                                <input
                                    type="text"
                                    value={property.name}
                                    className="mb-0"
                                    onChange={(ev) =>
                                        handlePropertyNameChange(
                                            index,
                                            property,
                                            ev.target.value
                                        )
                                    }
                                    placeholder="property name (example: color)"
                                />
                                <input
                                    type="text"
                                    className="mb-0"
                                    onChange={(ev) =>
                                        handlePropertyValuesChange(
                                            index,
                                            property,
                                            ev.target.value
                                        )
                                    }
                                    value={property.values}
                                    placeholder="values, comma separated"
                                />
                                <button
                                    onClick={() => removeProperty(index)}
                                    type="button"
                                    className="btn-red"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName("");
                                setParentCategory("");
                                setProperties([]);
                            }}
                            className="btn-red"
                        >
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn-default py-1">
                        Save
                    </button>
                </div>
            </form>
            {!editedCategory && (
                <table className="Basic mt-4">
                    <thead className="bg-teal-900">
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 &&
                            categories.map((category) => (
                                <tr key={category._id}>
                                    <td>{category.name}</td>
                                    <td>{category?.parent?.name}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                editCategory(category)
                                            }
                                            className="btn-default mr-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteCategory(category)
                                            }
                                            className="btn-red"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
