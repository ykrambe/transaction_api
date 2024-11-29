async function generateBookCode(title: string, author: string) {
    const titlePart = title.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const authorPart = author.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    
    const timestamp = Date.now().toString().slice(-4); 

    return `${titlePart}-${authorPart}-${timestamp}`;
}

async function generateMemberCode(name: string, job: string) {
    const namePart = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const jobPart = job.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    
    const timestamp = Date.now().toString().slice(-4); 

    return `${namePart}-${jobPart}-${timestamp}`;
}

export { generateBookCode, generateMemberCode }
