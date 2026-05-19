import { useState } from "react";
import { apiFetch } from "../services/api";
import type { Ratings } from "../types/Ratings";
import type { Question } from "../types/Question";
import type { LecturerEvaluationFormData } from "../types/LecturerEvaluationFormData";
import { questions } from "../data/questions";

type LecturerEvaluationFormComponentProps = {
  evaluationData: {
    department: string;
    faculty: string;
    gender: string;
    firstName: string;
    lastName: string;
    lecturerNames: [
      {
        lecturerID: string;
        lecturerName: string;
      },
    ];
    level: string;
    matricNum: string;
    otherNames: string;
    courseList: [
      {
        courseCode: string;
        courseTitle: string;
      },
    ];
  };
};

const LecturerEvaluationForm = ({
  evaluationData,
}: LecturerEvaluationFormComponentProps) => {
  const [formData, setFormData] = useState<LecturerEvaluationFormData>({
    matricNum: `${evaluationData.matricNum}`,
    faculty: `${evaluationData.faculty}`,
    department: `${evaluationData.department}`,
    courseCode: "",
    lecturerID: "",
    questionRatings: {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const questionsData: Question[] = questions;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (questionId: keyof Ratings, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      questionRatings: {
        ...prev.questionRatings,
        [questionId]: rating,
      },
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    const hasEmptyString = Object.values(formData.questionRatings).some(
      (value) => !value || value.toString().trim() === "",
    );

    if (hasEmptyString) {
      setError("Please provide your ratings for all questions!");
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiFetch("/api/evaluate", {
        method: "POST",
        body: { formData },
      });

      if (data) {
        console.log("Over here: ", data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="border-b-2 border-gray-300 pb-4 mb-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-normal text-gray-800">
              Students' Lecturer Evaluation Form
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Please fill in the required fields and answer the following
              questions honestly
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Name of Student:
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={`${evaluationData?.firstName} ${evaluationData.lastName} ${evaluationData.otherNames ? evaluationData.otherNames : ""}`}
                  readOnly
                  placeholder="Student full name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Matric Number:
                </label>
                <input
                  type="text"
                  name="matricNum"
                  value={formData.matricNum}
                  readOnly
                  placeholder="Enter Matric Number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Gender:
                </label>
                <input
                  type="text"
                  name="gender"
                  value={evaluationData.gender}
                  readOnly
                  placeholder="Gender"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Faculty:
                </label>
                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  readOnly
                  placeholder="Faculty"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Department:
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  readOnly
                  placeholder="Department"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Course Title (Course
                  Code):
                </label>
                <select
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Choose the course to be rated on</option>
                  {evaluationData.courseList.map((courseObj, index) => (
                    <option key={index} value={courseObj.courseCode}>
                      {courseObj.courseTitle} ({courseObj.courseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Level:
                </label>
                <input
                  type="text"
                  name="level"
                  value={evaluationData.level}
                  readOnly
                  placeholder="Level"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Name of the course
                  lecturer:
                </label>
                <select
                  name="lecturerID"
                  value={formData.lecturerID}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Choose the lecturer to be rated</option>
                  {evaluationData.lecturerNames.map(
                    (lecturerNameObj, index) => (
                      <option key={index} value={lecturerNameObj.lecturerID}>
                        {lecturerNameObj.lecturerName}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {/* <div className="mb-8">
              <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                <span className="text-red-500">*</span> Name of the course
                lecturer:
              </label>
              <select
                name="lecturerID"
                value={formData.lecturerID}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Choose the lecturer to be rated</option>
                {evaluationData.lecturerNames.map((lecturerNameObj, index) => (
                  <option key={index} value={lecturerNameObj.lecturerID}>
                    {lecturerNameObj.lecturerName}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <div className="text-xs sm:text-sm text-gray-700 flex flex-wrap gap-x-3 gap-y-1">
                  <span>
                    <span className="font-medium">1</span> = Strongly Disagree
                  </span>
                  <span>
                    <span className="font-medium">2</span> = Disagree
                  </span>
                  <span>
                    <span className="font-medium">3</span> = Neutral
                  </span>
                  <span>
                    <span className="font-medium">4</span> = Agree
                  </span>
                  <span>
                    <span className="font-medium">5</span> = Strongly Agree
                  </span>
                </div>
                <button
                  type="button"
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 self-start sm:self-auto whitespace-nowrap"
                >
                  Download Form ⬇
                </button>
              </div>

              <div className="bg-gray-100 border border-gray-300 overflow-x-auto">
                {/* Desktop view */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-[60px_1fr_400px] bg-gray-200 border-b border-gray-300">
                    <div className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-300">
                      S.N
                    </div>
                    <div className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-300">
                      Title
                    </div>
                    <div className="px-4 py-3 text-sm font-medium text-gray-700">
                      Actions
                    </div>
                  </div>

                  {questionsData.map((question, index) => (
                    <div
                      key={question.id}
                      className="grid grid-cols-[60px_1fr_400px] border-b border-gray-300 last:border-b-0"
                    >
                      <div className="px-4 py-4 text-sm text-gray-700 border-r border-gray-300 bg-white">
                        {index + 1}
                      </div>
                      <div className="px-4 py-4 text-sm text-gray-700 border-r border-gray-300 bg-white">
                        {question.text}
                      </div>
                      <div className="px-4 py-4 bg-white">
                        <div className="flex gap-2 justify-center">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() =>
                                handleRatingChange(question.id, rating)
                              }
                              className={`w-12 h-10 border border-gray-300 rounded text-sm transition-colors ${
                                formData.questionRatings[question.id] === rating
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile/Tablet view */}
                <div className="lg:hidden">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border-b border-gray-300 last:border-b-0 bg-white p-4"
                    >
                      <div className="flex gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                          {index + 1}
                        </div>
                        <div className="flex-1 text-xs sm:text-sm text-gray-700">
                          {question.text}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() =>
                              handleRatingChange(question.id, rating)
                            }
                            className={`w-10 h-10 sm:w-12 sm:h-10 border border-gray-300 rounded text-sm transition-colors ${
                              formData.questionRatings[question.id] === rating
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Submitting Evaluation..." : "Submit Evaluation"}
              </button>
            </div>

            {error && (
              <div className="mt-5 bg-red-100 p-4 rounded border border-red-200">
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LecturerEvaluationForm;
