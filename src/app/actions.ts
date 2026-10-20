"use server";

import fs from "fs";
import path from "path";
import { headers } from "next/headers";

async function verifyAuth() {
  const headersList = await headers();
  const basicAuth = headersList.get('authorization');
  if (!basicAuth) throw new Error("Unauthorized");
  
  const authValue = basicAuth.split(' ')[1];
  const [user, pwd] = atob(authValue).split(':');
  const validPassword = process.env.ADMIN_PASSWORD;
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  
  if (!validPassword || user !== validUser || pwd !== validPassword) {
    throw new Error("Unauthorized");
  }
}

// REQUEST SYSTEM

const requestsPath = path.join(process.cwd(), 'src', 'app', 'data', 'requests.json');

export interface MovieRequest {
  id: string;
  title: string;
  details: string;
  date: string;
}

export async function submitRequest(formData: FormData) {
  const newReq: MovieRequest = {
    id: Date.now().toString(),
    title: formData.get("title") as string,
    details: formData.get("details") as string || "",
    date: new Date().toISOString().split('T')[0]
  };

  try {
    let requests: MovieRequest[] = [];
    if (fs.existsSync(requestsPath)) {
      requests = JSON.parse(fs.readFileSync(requestsPath, 'utf8'));
    }
    requests.push(newReq);
    fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 2));
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function getRequests() {
  try {
    await verifyAuth(); // Only admin can read requests
    if (fs.existsSync(requestsPath)) {
      return JSON.parse(fs.readFileSync(requestsPath, 'utf8')) as MovieRequest[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function deleteRequest(id: string) {
  try {
    await verifyAuth();
    let requests: MovieRequest[] = [];
    if (fs.existsSync(requestsPath)) {
      requests = JSON.parse(fs.readFileSync(requestsPath, 'utf8'));
    }
    const newRequests = requests.filter(r => r.id !== id);
    fs.writeFileSync(requestsPath, JSON.stringify(newRequests, null, 2));
    return { success: true };
  } catch {
    return { success: false };
  }
}
