'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface AutocompleteProps {
    options: string[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    label?: string
    required?: boolean
    id?: string
}

export default function Autocomplete({
    options,
    value,
    onChange,
    placeholder = 'Type to search...',
    label,
    required = false,
    id,
}: AutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filteredOptions, setFilteredOptions] = useState<string[]>(options)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (value.length >= 1) {
            const filtered = options.filter((option) =>
                option.toLowerCase().includes(value.toLowerCase())
            )
            setFilteredOptions(filtered)
        } else {
            setFilteredOptions(options)
        }
    }, [value, options])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (option: string) => {
        onChange(option)
        setIsOpen(false)
    }

    return (
        <div ref={wrapperRef} className="relative">
            {label && (
                <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <span className="text-nss-red">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    required={required}
                    className="input-field pr-10"
                    autoComplete="off"
                />
                <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </div>

            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(option)}
                            className="px-4 py-2 hover:bg-nss-blue hover:text-white cursor-pointer transition-colors"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}

            {isOpen && filteredOptions.length === 0 && value.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 text-gray-500 text-sm">
                    No matches found
                </div>
            )}
        </div>
    )
}
