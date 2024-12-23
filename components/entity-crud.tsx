import React, { useState, useEffect } from 'react'
import { DataTable } from './data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet'

interface EntityCrudProps<T> {
  entityName: string
  columns: { key: keyof T; label: string }[]
  fetchItems: () => Promise<T[]>
  createItem: (item: Partial<T>) => Promise<T>
  updateItem: (id: number, item: Partial<T>) => Promise<T>
  deleteItem: (id: number) => Promise<void>
}

export function EntityCrud<T extends { id: number }>({ 
  entityName, 
  columns, 
  fetchItems, 
  createItem, 
  updateItem, 
  deleteItem 
}: EntityCrudProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<Partial<T>>({})

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setIsLoading(true)
    try {
      const data = await fetchItems()
      setItems(data)
    } catch (error) {
      console.error(`Error fetching ${entityName}:`, error)
    }
    setIsLoading(false)
  }

  const handleCreate = async () => {
    try {
      await createItem(currentItem)
      setCurrentItem({})
      loadItems()
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error)
    }
  }

  const handleUpdate = async () => {
    if (currentItem.id) {
      try {
        await updateItem(currentItem.id, currentItem)
        setCurrentItem({})
        setIsEditing(false)
        loadItems()
      } catch (error) {
        console.error(`Error updating ${entityName}:`, error)
      }
    }
  }

  const handleDelete = async (item: T) => {
    try {
      await deleteItem(item.id)
      loadItems()
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{entityName}</h2>
      <Button onClick={() => setIsEditing(true)} className="mb-4">Add {entityName}</Button>
      <DataTable
        data={items}
        columns={columns}
        onEdit={(item) => {
          setCurrentItem(item)
          setIsEditing(true)
        }}
        onDelete={handleDelete}
      />
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{currentItem.id ? `Edit ${entityName}` : `Add ${entityName}`}</SheetTitle>
            <SheetDescription>Make changes to the {entityName.toLowerCase()} here. Click save when you're done.</SheetDescription>
          </SheetHeader>
          {columns.map((column) => (
            <div key={column.key as string} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{column.label}</label>
              <Input
                type="text"
                value={currentItem[column.key] as string || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, [column.key]: e.target.value })}
              />
            </div>
          ))}
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={currentItem.id ? handleUpdate : handleCreate}>
                {currentItem.id ? 'Update' : 'Create'}
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

