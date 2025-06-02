import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { TrendingUp, Users, BookOpen, Award } from "lucide-react";
import ModelEvaluationContent from "@/components/ModelEvaluationContent";

const GENDER_COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

interface Course {
    courseId: number;
    name: string;
    numVideos: number;
    numProblems: number;
    numResources: number;
}

interface GenderData {
    gender: string;
    percentage: number;
}

interface CommentData {
    week: string;
    num_comments: number;
}

interface ScoreData {
    week: string;
    avg_score: number;
}

interface ScoreOverTimeData {
    date: string;
    score: number;
}

export default function Dashboard() {
    const [tab, setTab] = useState("overview");
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [genderData, setGenderData] = useState<GenderData[]>([]);
    const [commentData, setCommentData] = useState<CommentData[]>([]);
    const [scoreData, setScoreData] = useState<ScoreData[]>([]);
    const [satisfactionData, setSatisfactionData] = useState<ScoreOverTimeData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/v1/course")
            .then((res) => res.json())
            .then((data) => setCourses(data.courseOverview))
            .catch((error) => console.error("Error fetching courses:", error));

        fetch("http://127.0.0.1:5000/api/v1/satisfaction_over_time")
            .then((res) => res.json())
            .then((data) => setSatisfactionData(data))
            .catch((err) => console.error("Error fetching satisfaction data:", err));
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            setLoading(true);
            Promise.all([
                fetch(`http://127.0.0.1:5000/api/v1/gender/${selectedCourse}`).then(res => res.json()),
                fetch(`http://127.0.0.1:5000/api/v1/week_com/${selectedCourse}`).then(res => res.json()),
                fetch(`http://127.0.0.1:5000/api/v1/week_sco/${selectedCourse}`).then(res => res.json())
            ])
                .then(([genderData, commentData, scoreData]) => {
                    setGenderData(genderData);
                    setCommentData(commentData);
                    setScoreData(scoreData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [selectedCourse]);

    return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="course">Khóa học</TabsTrigger>
                    <TabsTrigger value="model">Mô hình</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Tổng học viên
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">2,845</div>
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +12.5% so với kỳ trước
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Khóa học
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">128</div>
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +5.2% so với kỳ trước
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    Tỉ lệ hài lòng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">85.4%</div>
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +3.7% so với kỳ trước
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Độ chính xác mô hình
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">92.3%</div>
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +1.4% so với kỳ trước
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-research-primary" />
                                <span>Phân bố mức độ hài lòng theo thời gian</span>
                            </CardTitle>
                            <CardDescription>
                                Phân tích xu hướng độ hài lòng của học viên theo các giai đoạn khóa học
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                {loading ? (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Skeleton className="h-[300px] w-full rounded" />
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={satisfactionData}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis domain={[50, 100]} />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                name="Điểm hài lòng trung bình"
                                                stroke="#8884d8"
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="course">
                    <div className="space-y-6 mt-4">
                        <Select onValueChange={(value) => setSelectedCourse(value)}>
                            <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Chọn khóa học" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem key={course.courseId} value={course.courseId.toString()}>
                                        {course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedCourse && (() => {
                            const selected = courses.find(c => c.courseId.toString() === selectedCourse);
                            if (!selected) return null;
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Mã khóa học</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xl font-bold">{selected.courseId}</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Số lượng video</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xl font-bold">{selected.numVideos}</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Số lượng bài tập</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xl font-bold">{selected.numProblems}</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Số lượng tài nguyên</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xl font-bold">{selected.numResources}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })()}

                        {selectedCourse && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {loading ? (
                                    <>
                                        <Skeleton className="h-[300px]" />
                                        <Skeleton className="h-[300px]" />
                                        <Skeleton className="h-[300px]" />
                                        <Skeleton className="h-[300px]" />
                                    </>
                                ) : (
                                    <>
                                        {genderData.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Phân bố giới tính</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <PieChart>
                                                            <Pie
                                                                data={genderData}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ gender, percentage }) => `${gender}: ${percentage}%`}
                                                                outerRadius={80}
                                                                fill="#8884d8"
                                                                dataKey="percentage"
                                                            >
                                                                {genderData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {commentData.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Số lượng bình luận theo tuần</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <BarChart data={commentData}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="week" />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Bar dataKey="num_comments" fill="#8884d8" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {scoreData.length > 0 && (
                                            <Card className="lg:col-span-2">
                                                <CardHeader>
                                                    <CardTitle>Điểm số trung bình theo tuần</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <LineChart data={scoreData}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="week" />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Line type="monotone" dataKey="avg_score" stroke="#82ca9d" strokeWidth={2} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="model">
                    <Card>
                        <CardHeader>
                            <CardTitle>Đánh giá mô hình</CardTitle>
                            <CardDescription>
                                Kết quả đánh giá và huấn luyện các mô hình machine learning
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ModelEvaluationContent />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
