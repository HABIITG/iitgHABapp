import { useState } from "react";
import { Button } from "../components/ui/button";

export default function BugReport() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: "",
    device: "",
    os: "",
    appVersion: "",
    frequency: "",
  });
  const [screenshots, setScreenshots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 screenshots allowed");
      return;
    }
    setScreenshots(files);
  };

  const removeScreenshot = (index) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setSubmitStatus({ type: "error", message: "Title and description are required" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      if (formData.email) {
        formDataToSend.append("email", formData.email);
      }
      
      const deviceInfo = {
        device: formData.device || "Not provided",
        os: formData.os || "Not provided",
        appVersion: formData.appVersion || "Not provided",
      };
      formDataToSend.append("deviceInfo", JSON.stringify(deviceInfo));
      
      if (formData.frequency) {
        formDataToSend.append("frequency", formData.frequency);
      }

      screenshots.forEach((file) => {
        formDataToSend.append("screenshots", file);
      });

      const apiBase = import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";
      const response = await fetch(`${apiBase}/bug-report`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: "success", message: "Bug report submitted successfully!" });
        // Reset form
        setFormData({
          title: "",
          description: "",
          email: "",
          device: "",
          os: "",
          appVersion: "",
          frequency: "",
        });
        setScreenshots([]);
      } else {
        setSubmitStatus({ type: "error", message: data.message || "Failed to submit bug report" });
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Report a Bug
          </h1>
          <div className="border-t border-gray-300 pt-4">
            <p className="text-gray-700 leading-relaxed">
              Found a bug? Help us improve the app by reporting it. Your feedback is valuable to us.
            </p>
          </div>
        </div>

        {/* Bug Report Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6149CD] focus:border-transparent"
              placeholder="Brief description of the bug"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6149CD] focus:border-transparent"
              placeholder="Describe the bug in detail. Include steps to reproduce if possible."
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6149CD] focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Device Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="device" className="block text-sm font-medium text-gray-900 mb-2">
                Device (Optional)
              </label>
              <input
                type="text"
                id="device"
                name="device"
                value={formData.device}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6149CD] focus:border-transparent"
                placeholder="e.g., iPhone 14 Pro"
              />
            </div>
            <div>
              <label htmlFor="os" className="block text-sm font-medium text-gray-900 mb-2">
                OS Version (Optional)
              </label>
              <input
                type="text"
                id="os"
                name="os"
                value={formData.os}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6149CD] focus:border-transparent"
                placeholder="e.g., iOS 18.0"
              />
            </div>
            <div>
              <label htmlFor="appVersion" className="block text-sm font-medium text-gray-900 mb-2">
                App Version (Optional)
              </label>
              <input
                type="text"
                id="appVersion"
                name="appVersion"
                value={formData.appVersion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6149CD] focus:border-transparent"
                placeholder="e.g., 1.0.0"
              />
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-900 mb-2">
              Frequency (Optional)
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6149CD] focus:border-transparent"
            >
              <option value="">Select frequency</option>
              <option value="always">Always</option>
              <option value="sometimes">Sometimes</option>
              <option value="once">Once</option>
            </select>
          </div>

          {/* Screenshots */}
          <div>
            <label htmlFor="screenshots" className="block text-sm font-medium text-gray-900 mb-2">
              Screenshots (Optional, Max 5)
            </label>
            <input
              type="file"
              id="screenshots"
              name="screenshots"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6149CD] focus:border-transparent"
            />
            {screenshots.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                {screenshots.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeScreenshot(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Status */}
          {submitStatus && (
            <div
              className={`p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6149CD] hover:bg-[#5039B8] text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Bug Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
