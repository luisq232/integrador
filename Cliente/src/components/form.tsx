import { categories } from "../data/categories"
import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { Activity } from "../types"

//tenemos un componente y lo estamos exportando
export default function Form() {
    const isValidActivity = () => {
        const { name, calorias } = activity
        return name.trim() !== '' && calorias > 0
    }

    const [activity, setActivity] = useState<Activity>({
        category: 1,
        name: '',
        calorias: 0
    })

    // Estado para almacenar los registros y cargarlos desde localStorage
    const [records, setRecords] = useState<Activity[]>([])

    const [editIndex, setEditIndex] = useState<number | null>(null) // Estado para manejar el índice del registro en edición

    // Función para cargar los registros desde localStorage al montar el componente
    useEffect(() => {
        const storedRecords = localStorage.getItem('records')
        if (storedRecords) {
            setRecords(JSON.parse(storedRecords))
        }
    }, [])

    // Función para guardar los registros en localStorage
    useEffect(() => {
        if (records.length > 0) {
            localStorage.setItem('records', JSON.stringify(records))
        }
    }, [records])

    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const isNumberField = ['category', 'calorias'].includes(e.target.id)
        setActivity({
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value : e.target.value
        })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (isValidActivity()) {
            if (editIndex !== null) {
                // Actualizar el registro en edición
                const updatedRecords = records.map((record, index) =>
                    index === editIndex ? { ...activity } : record // Crear una copia del objeto actualizado
                )
                setRecords(updatedRecords) // Actualizar el estado de los registros
                setEditIndex(null) // Salir del modo de edición
            } else {
                // Agregar un nuevo registro
                setRecords([...records, { ...activity }]) // Crear una copia del objeto antes de agregarlo
            }

            // Reiniciar el formulario
            setActivity({ category: 1, name: '', calorias: 0 }) 
        }
    }

    const handleEdit = (index: number) => {
        setEditIndex(index) // Establecer el índice del registro en edición
        setActivity({ ...records[index] }) // Crear una copia del registro para evitar mutaciones directas
    }

    const handleDelete = (index: number) => {
        const updatedRecords = records.filter((_, i) => i !== index)
        setRecords(updatedRecords) // Eliminar el registro seleccionado
    }

    const handleClearRecords = () => {
        setRecords([]); // Limpiar la lista de registros
        localStorage.removeItem('records') // Limpiar los registros en localStorage
    }

    return (
        <>
            <form className="space-y-5 bg-white shadow p-10 rounded-lg" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-3">
                    <label htmlFor="category" className="font-bold">Servicio :</label>
                    <select
                        className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                        id="category"
                        value={activity.category}
                        onChange={handleChange}
                    >
                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    <label htmlFor="name" className="font-bold">Nombre del cliente :</label>
                    <input
                        id="name"
                        type="text"
                        className="border border-slate-300 p-2 rounded-lg"
                        placeholder="Ejemplo : Alex de jesus"
                        value={activity.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="grid grid-cols-1 gap-3">
                    <label htmlFor="calorias" className="font-bold">Precio:</label>
                    <input
                        id="calorias"
                        type="number"
                        className="border border-slate-300 p-2 rounded-lg"
                        placeholder="Precio. EJ. 300 $ o 500 $"
                        value={activity.calorias}
                        onChange={handleChange}
                    />
                    <input
                        type="submit"
                        className="bg-blue-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
                        value={editIndex !== null ? 'Actualizar registro' : 'Guardar registro'}
                        disabled={!isValidActivity()}
                    />
                </div>
            </form>

            <div className="mt-10">
                <h2 className="text-lg font-bold">Registros:</h2>

                {records.length === 0 ? (
                    <p className="text-gray-500">No hay registros aún.</p>
                ) : (
                    <ul className="space-y-3">
                        {records.map((record, index) => (
                            <li key={index} className="border border-slate-300 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p>
                                        <strong>Servicio:</strong>{" "}
                                        {categories.find((cat) => cat.id === record.category)?.name}
                                    </p>
                                    <p>
                                        <strong>Nombre:</strong> {record.name}
                                    </p>
                                    <p>
                                        <strong>Precio :</strong> {record.calorias}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                                        onClick={() => handleEdit(index)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                
                <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={handleClearRecords} // Ahora, la función de limpiar registros es parte de este botón
                >
                    Limpiar registros
                </button>
            </div>
        </>
    )
}