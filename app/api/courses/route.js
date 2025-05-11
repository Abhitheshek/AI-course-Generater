import { NextResponse } from 'next/server';
import { getAllCourses, saveCourse } from '@/app/lib/localStorage';

export async function GET() {
  try {
    // Using localStorage instead of MongoDB
    const courses = getAllCourses();
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Save to localStorage instead of MongoDB
    const newCourse = saveCourse(body);
    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}