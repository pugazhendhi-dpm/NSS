'use client'

import { useEffect, useState } from 'react'
import { Calendar, Sparkles } from 'lucide-react'

interface SpecialDay {
    name: string
    description: string
}

export default function TodaySpecialDay() {
    const [specialDay, setSpecialDay] = useState<SpecialDay | null>(null)

    useEffect(() => {
        const today = new Date()
        const month = today.getMonth() + 1
        const day = today.getDate()

        const todaySpecial = getSpecialDay(month, day)
        setSpecialDay(todaySpecial)
    }, [])

    // Comprehensive Important Days Database
    const getSpecialDay = (month: number, day: number): SpecialDay | null => {
        const specialDays: { [key: string]: SpecialDay } = {
            // JANUARY
            '1-1': { name: 'Global Family Day', description: 'New Year Celebration' },
            '1-2': { name: 'World Introvert Day', description: 'Social Awareness' },
            '1-4': { name: 'World Braille Day', description: 'Accessibility' },
            '1-6': { name: 'World Day of War Orphans', description: 'Humanitarian' },
            '1-9': { name: 'Pravasi Bharatiya Divas', description: 'India' },
            '1-10': { name: 'World Hindi Day', description: 'Language' },
            '1-11': { name: 'Lal Bahadur Shastri Death Anniversary', description: 'India' },
            '1-12': { name: 'National Youth Day', description: 'Swami Vivekananda 🇮🇳' },
            '1-13': { name: 'Lohri Awareness Day', description: 'Cultural' },
            '1-14': { name: 'Makar Sankranti', description: 'Cultural Festival' },
            '1-15': { name: 'Army Day', description: 'India 🇮🇳' },
            '1-16': { name: 'National Startup Day', description: 'India' },
            '1-18': { name: 'World Waterbody Protection Day', description: 'Environment' },
            '1-20': { name: 'World Day of Social Justice', description: 'UN' },
            '1-23': { name: 'Netaji Subhash Chandra Bose Jayanti', description: 'India 🇮🇳' },
            '1-24': { name: 'National Girl Child Day', description: 'India' },
            '1-25': { name: 'National Voters\' Day', description: 'India' },
            '1-26': { name: 'Republic Day', description: 'National Holiday 🇮🇳' },
            '1-27': { name: 'International Holocaust Remembrance Day', description: 'UN' },
            '1-28': { name: 'Data Privacy Day', description: 'Technology' },
            '1-30': { name: 'Martyrs\' Day', description: 'Mahatma Gandhi 🇮🇳' },
            '1-31': { name: 'International Zebra Day', description: 'Wildlife' },

            // FEBRUARY
            '2-1': { name: 'Indian Coast Guard Day', description: 'India' },
            '2-2': { name: 'World Wetlands Day', description: 'Environment' },
            '2-4': { name: 'World Cancer Day', description: 'Health' },
            '2-6': { name: 'International Day of Zero Tolerance for FGM', description: 'UN' },
            '2-10': { name: 'World Pulses Day', description: 'Agriculture' },
            '2-11': { name: 'International Day of Women & Girls in Science', description: 'UN' },
            '2-13': { name: 'World Radio Day', description: 'Media' },
            '2-14': { name: 'Valentine\'s Day', description: 'Love & Care' },
            '2-15': { name: 'International Childhood Cancer Day', description: 'Health' },
            '2-18': { name: 'Taj Mahotsav Day', description: 'Heritage' },
            '2-20': { name: 'World Day of Social Justice', description: 'UN' },
            '2-21': { name: 'International Mother Language Day', description: 'UNESCO' },
            '2-22': { name: 'World Thinking Day', description: 'Scouts & Guides' },
            '2-24': { name: 'Central Excise Day', description: 'India' },
            '2-27': { name: 'World NGO Day', description: 'Social Service' },
            '2-28': { name: 'National Science Day', description: 'India 🇮🇳' },

            // MARCH
            '3-1': { name: 'Zero Discrimination Day', description: 'UN' },
            '3-3': { name: 'World Wildlife Day', description: 'Environment' },
            '3-4': { name: 'World Obesity Day', description: 'Health' },
            '3-6': { name: 'World Hearing Day', description: 'Health' },
            '3-8': { name: 'International Women\'s Day', description: 'UN' },
            '3-10': { name: 'CISF Raising Day', description: 'India' },
            '3-12': { name: 'World Glaucoma Day', description: 'Health' },
            '3-14': { name: 'Pi Day', description: 'Education' },
            '3-15': { name: 'World Consumer Rights Day', description: 'UN' },
            '3-16': { name: 'National Vaccination Day', description: 'India' },
            '3-18': { name: 'Ordnance Factory Day', description: 'India' },
            '3-20': { name: 'International Day of Happiness', description: 'UN' },
            '3-21': { name: 'International Day of Forests', description: 'UN' },
            '3-22': { name: 'World Water Day', description: 'UN' },
            '3-23': { name: 'Shaheed Diwas', description: 'Bhagat Singh 🇮🇳' },
            '3-24': { name: 'World Tuberculosis Day', description: 'Health' },
            '3-27': { name: 'World Theatre Day', description: 'Arts & Culture' },

            // APRIL
            '4-2': { name: 'World Autism Awareness Day', description: 'UN' },
            '4-5': { name: 'National Maritime Day', description: 'India' },
            '4-7': { name: 'World Health Day', description: 'WHO' },
            '4-10': { name: 'World Homeopathy Day', description: 'Health' },
            '4-11': { name: 'National Safe Motherhood Day', description: 'India' },
            '4-13': { name: 'Jallianwala Bagh Memorial Day', description: 'India 🇮🇳' },
            '4-14': { name: 'Ambedkar Jayanti', description: 'National Holiday 🇮🇳' },
            '4-17': { name: 'World Hemophilia Day', description: 'Health' },
            '4-18': { name: 'World Heritage Day', description: 'UNESCO' },
            '4-22': { name: 'Earth Day', description: 'Environment' },
            '4-23': { name: 'World Book Day', description: 'UNESCO' },
            '4-25': { name: 'World Malaria Day', description: 'Health' },
            '4-28': { name: 'World Safety & Health at Work Day', description: 'UN' },

            // MAY
            '5-1': { name: 'International Labour Day', description: 'Workers\' Rights' },
            '5-3': { name: 'World Press Freedom Day', description: 'UNESCO' },
            '5-5': { name: 'World Hand Hygiene Day', description: 'Health' },
            '5-7': { name: 'World Athletics Day', description: 'Sports' },
            '5-8': { name: 'World Red Cross Day', description: 'Humanitarian' },
            '5-12': { name: 'International Nurses Day', description: 'Health' },
            '5-15': { name: 'International Day of Families', description: 'UN' },
            '5-16': { name: 'International Day of Light', description: 'UNESCO' },
            '5-17': { name: 'World Telecommunication Day', description: 'UN' },
            '5-21': { name: 'Anti-Terrorism Day', description: 'India' },
            '5-22': { name: 'International Day for Biodiversity', description: 'UN' },
            '5-31': { name: 'World No Tobacco Day', description: 'WHO' },

            // JUNE
            '6-1': { name: 'World Milk Day', description: 'Agriculture' },
            '6-3': { name: 'World Bicycle Day', description: 'UN' },
            '6-5': { name: 'World Environment Day', description: 'UN' },
            '6-7': { name: 'World Food Safety Day', description: 'UN' },
            '6-8': { name: 'World Oceans Day', description: 'UN' },
            '6-12': { name: 'World Day Against Child Labour', description: 'UN' },
            '6-14': { name: 'World Blood Donor Day', description: 'WHO ⭐' },
            '6-15': { name: 'World Elder Abuse Awareness Day', description: 'UN' },
            '6-20': { name: 'World Refugee Day', description: 'UN' },
            '6-21': { name: 'International Yoga Day', description: 'India 🇮🇳' },
            '6-23': { name: 'UN Public Service Day', description: 'UN' },
            '6-26': { name: 'International Day Against Drug Abuse', description: 'UN' },

            // JULY
            '7-1': { name: 'National Doctors\' Day', description: 'India' },
            '7-6': { name: 'World Zoonoses Day', description: 'Health' },
            '7-11': { name: 'World Population Day', description: 'UN' },
            '7-15': { name: 'World Youth Skills Day', description: 'UN' },
            '7-18': { name: 'Nelson Mandela International Day', description: 'UN' },
            '7-22': { name: 'World Brain Day', description: 'Health' },
            '7-28': { name: 'World Hepatitis Day', description: 'WHO' },
            '7-29': { name: 'International Tiger Day', description: 'Wildlife' },
            '7-30': { name: 'World Day Against Trafficking', description: 'UN' },

            // AUGUST
            '8-1': { name: 'World Breastfeeding Week Begins', description: 'Health' },
            '8-6': { name: 'Hiroshima Day', description: 'Peace' },
            '8-9': { name: 'Quit India Movement Day', description: 'India 🇮🇳' },
            '8-12': { name: 'International Youth Day', description: 'UN' },
            '8-15': { name: 'Independence Day', description: 'National Holiday 🇮🇳' },
            '8-19': { name: 'World Humanitarian Day', description: 'UN' },
            '8-20': { name: 'Sadbhavana Diwas', description: 'India' },
            '8-23': { name: 'ISRO National Space Day', description: 'India' },
            '8-29': { name: 'National Sports Day', description: 'India' },

            // SEPTEMBER
            '9-5': { name: 'Teachers\' Day', description: 'India 🇮🇳' },
            '9-8': { name: 'International Literacy Day', description: 'UNESCO' },
            '9-14': { name: 'Hindi Diwas', description: 'India' },
            '9-15': { name: 'Engineers\' Day', description: 'India' },
            '9-16': { name: 'World Ozone Day', description: 'UN' },
            '9-21': { name: 'International Day of Peace', description: 'UN' },
            '9-25': { name: 'World Pharmacists Day', description: 'Health' },
            '9-27': { name: 'World Tourism Day', description: 'UN' },
            '9-28': { name: 'World Rabies Day', description: 'Health' },

            // OCTOBER
            '10-1': { name: 'International Day of Older Persons', description: 'UN' },
            '10-2': { name: 'Gandhi Jayanti', description: 'National Holiday 🇮🇳' },
            '10-4': { name: 'World Animal Welfare Day', description: 'Wildlife' },
            '10-5': { name: 'World Teachers\' Day', description: 'UNESCO' },
            '10-10': { name: 'World Mental Health Day', description: 'WHO' },
            '10-11': { name: 'International Day of the Girl Child', description: 'UN' },
            '10-15': { name: 'World Handwashing Day', description: 'Health' },
            '10-16': { name: 'World Food Day', description: 'UN' },
            '10-24': { name: 'UN Day', description: 'United Nations' },
            '10-31': { name: 'National Unity Day', description: 'India 🇮🇳' },

            // NOVEMBER
            '11-1': { name: 'World Vegan Day', description: 'Lifestyle' },
            '11-5': { name: 'World Tsunami Awareness Day', description: 'UN' },
            '11-10': { name: 'World Science Day', description: 'UNESCO' },
            '11-14': { name: 'Children\'s Day', description: 'India 🇮🇳' },
            '11-16': { name: 'International Tolerance Day', description: 'UNESCO' },
            '11-19': { name: 'World Toilet Day', description: 'UN' },
            '11-20': { name: 'Universal Children\'s Day', description: 'UN' },
            '11-26': { name: 'Constitution Day', description: 'India 🇮🇳' },

            // DECEMBER
            '12-1': { name: 'World AIDS Day', description: 'WHO' },
            '12-2': { name: 'National Pollution Control Day', description: 'India' },
            '12-3': { name: 'International Day of Persons with Disabilities', description: 'UN' },
            '12-4': { name: 'Indian Navy Day', description: 'India' },
            '12-5': { name: 'International Volunteer Day', description: 'UN ⭐ NSS' },
            '12-7': { name: 'Armed Forces Flag Day', description: 'India' },
            '12-10': { name: 'Human Rights Day', description: 'UN' },
            '12-18': { name: 'International Migrants Day', description: 'UN' },
            '12-23': { name: 'National Farmers\' Day', description: 'India' },
            '12-25': { name: 'Good Governance Day', description: 'India' },
        }

        const key = `${month}-${day}`
        return specialDays[key] || null
    }

    if (!specialDay) {
        return null
    }

    return (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Today's Special Day:</span>
                <span className="font-bold">{specialDay.name}</span>
                <span className="text-sm opacity-90">({specialDay.description})</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
        </div>
    )
}
