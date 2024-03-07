export default function formatDate(data) {
    const originalDate = new Date(data);
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const date = originalDate.getDate().toString().padStart(2, '0');
    const hours = originalDate.getHours().toString().padStart(2, '0');
    const minutes = originalDate.getMinutes().toString().padStart(2, '0');
    const seconds = originalDate.getSeconds().toString().padStart(2, '0');

    return `${year}.${month}.${date}/${hours}:${minutes}:${seconds}`;
}
