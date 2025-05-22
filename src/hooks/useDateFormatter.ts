import { ref } from 'vue'

export function useDateFormatter() {

    const formatDate = (timestamp: string | number | Date, format: 'date' | 'time' = 'date') => {
        const date = new Date(timestamp)

        if (format === 'date') {
            return date.toLocaleDateString()
        } else {
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
        }
    }


    return {
        formatDate,
    }
} 