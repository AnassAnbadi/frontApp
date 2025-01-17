export function exportToCSV(data: any[], filename: string) {
    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [
        Object.keys(data[0]).join(","),
        ...data.map(item => Object.values(item).join(","))
      ].join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }