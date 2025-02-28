import React, { useState } from "react";
import Calendar from "react-calendar";
import Slider from "react-slick";
import "react-calendar/dist/Calendar.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChurchEventsPage = () => {
  // Dummy data for church events
  const events = [
    {
      id: 1,
      title: "Sunday Worship Service",
      description:
        "Join us for uplifting worship and inspiring sermons to start your week.",
      date: "2025-03-30",
      status: "upcoming",
      images: [
        "https://via.placeholder.com/400x200?text=Worship+Image+1",
        "https://via.placeholder.com/400x200?text=Worship+Image+2",
      ],
      pdfUrl: "https://example.com/event1.pdf",
    },
    {
      id: 2,
      title: "Bible Study Meeting",
      description:
        "Deep dive into the Scriptures and discuss their meaning with fellow believers.",
      date: "2025-03-28",
      status: "ongoing",
      images: ["https://via.placeholder.com/400x200?text=Bible+Study+Image"],
      pdfUrl: "https://example.com/event2.pdf",
    },
    {
      id: 3,
      title: "Community Fellowship",
      description:
        "A time for fellowship, prayer, and community bonding. Everyone is welcome!",
      date: "2025-04-05",
      status: "upcoming",
      images: [], // No images provided for this event
      pdfUrl: "", // No PDF available
    },
  ];

  // Dummy data for admin-uploaded church calendar
  const adminCalendar = {
    images: [
      "https://via.placeholder.com/600x300?text=Church+Calendar+1",
      "https://via.placeholder.com/600x300?text=Church+Calendar+2",
    ],
    pdfUrl: "https://example.com/church-calendar.pdf",
  };

  // State for selected calendar date (for display purposes)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Slider settings for both event images and calendar slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Dummy handlers
  const handlePurchase = (eventItem) => {
    toast.success(`Ticket purchased for "${eventItem.title}"`);
  };

  const handleDownloadEventPDF = (eventItem) => {
    if (eventItem.pdfUrl) {
      window.open(eventItem.pdfUrl, "_blank");
    } else {
      toast.info("No PDF available for this event.");
    }
  };

  const handleDownloadCalendarPDF = () => {
    if (adminCalendar.pdfUrl) {
      window.open(adminCalendar.pdfUrl, "_blank");
    } else {
      toast.info("No PDF available for the calendar.");
    }
  };

  return (
    <div>
      {/* Top Banner */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://via.placeholder.com/1200x400?text=Church+Events')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">
            Church Events & Calendar
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Calendar Section */}
          <div className="md:w-1/3">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full rounded-lg shadow-md"
            />
            <p className="mt-4 text-center text-xl">
              Selected Date: {selectedDate.toDateString()}
            </p>
          </div>

          {/* Right: Two Sections (Calendar Downloads & Church Events) */}
          <div className="md:w-2/3 space-y-6">
            {/* Admin Calendar Downloads Section */}
            <div className="card bg-base-100 shadow-xl p-4 border border-gray-200">
              <div className="card-body">
                <h2 className="card-title text-2xl">Church Calendar</h2>
                <Slider {...sliderSettings}>
                  {adminCalendar.images.map((img, idx) => (
                    <div key={idx}>
                      <img
                        src={img}
                        alt={`Calendar ${idx + 1}`}
                        className="w-full h-auto rounded"
                      />
                    </div>
                  ))}
                </Slider>
                <button
                  className="btn btn-secondary mt-4"
                  onClick={handleDownloadCalendarPDF}
                >
                  Download Calendar PDF
                </button>
              </div>
            </div>

            {/* Church Events Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Church Events</h2>
              {events.map((eventItem) => (
                <div
                  key={eventItem.id}
                  className="card bg-base-100 shadow-xl p-4 border border-gray-200"
                >
                  <div className="card-body">
                    <h2 className="card-title text-2xl">{eventItem.title}</h2>
                    <p className="text-lg">{eventItem.description}</p>
                    <p className="text-md">
                      <strong>Date:</strong>{" "}
                      {new Date(eventItem.date).toDateString()}
                    </p>
                    <p className="text-md">
                      <strong>Status:</strong> {eventItem.status}
                    </p>
                    {/* Event Images Slider (if images exist) */}
                    {eventItem.images && eventItem.images.length > 0 && (
                      <div className="my-4">
                        <Slider {...sliderSettings}>
                          {eventItem.images.map((img, idx) => (
                            <div key={idx}>
                              <img
                                src={img}
                                alt={`Event ${eventItem.title} - ${idx + 1}`}
                                className="w-full h-auto rounded"
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>
                    )}
                    <div className="card-actions justify-end space-x-2 mt-4">
                      <button
                        className="btn btn-primary"
                        onClick={() => handlePurchase(eventItem)}
                      >
                        Purchase Ticket
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleDownloadEventPDF(eventItem)}
                      >
                        Download Event PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChurchEventsPage;
