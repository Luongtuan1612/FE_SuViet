import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  historyService,
  type HistoricalPeriod,
  type HistoryEvent,
} from "../../services/historyService";
import { quizService, type QuizTopic } from "../../services/quizService";
import { HomeAiCta } from "../components/home/HomeAiCta";
import { HomeError } from "../components/home/HomeError";
import { HomeFeatureCards } from "../components/home/HomeFeatureCards";
import { HomeFeaturedEvents } from "../components/home/HomeFeaturedEvents";
import { HomeFeaturedFigures } from "../components/home/HomeFeaturedFigures";
import { HomeHero } from "../components/home/HomeHero";
import { HomeLoading } from "../components/home/HomeLoading";
import { HomeRecentEvents } from "../components/home/HomeRecentEvents";
import { getErrorMessage, getFeaturedFigures } from "../utils/homeUtils";

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [periods, setPeriods] = useState<HistoricalPeriod[]>([]);
  const [quizTopics, setQuizTopics] = useState<QuizTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const featuredEvents = useMemo(() => {
    return events.slice(0, 3);
  }, [events]);

  const recentEvents = useMemo(() => {
    return events.slice(3, 7);
  }, [events]);

  const featuredFigures = useMemo(() => {
    return getFeaturedFigures(events, 6);
  }, [events]);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [eventsResult, periodsResult, quizTopicsResult] =
        await Promise.allSettled([
          historyService.getAllArticles(),
          historyService.getAllPeriods(),
          quizService.getAllTopics(),
        ]);

      if (eventsResult.status === "fulfilled") {
        setEvents(eventsResult.value || []);
      } else {
        throw new Error(getErrorMessage(eventsResult.reason));
      }

      if (periodsResult.status === "fulfilled") {
        setPeriods(periodsResult.value || []);
      } else {
        setPeriods([]);
      }

      if (quizTopicsResult.status === "fulfilled") {
        setQuizTopics(quizTopicsResult.value || []);
      } else {
        setQuizTopics([]);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setEvents([]);
      setPeriods([]);
      setQuizTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/su-kien?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickSearch = (keyword: string) => {
    navigate(`/su-kien?q=${encodeURIComponent(keyword)}`);
  };

  if (isLoading) {
    return <HomeLoading />;
  }

  if (errorMessage) {
    return <HomeError errorMessage={errorMessage} onRetry={loadHomeData} />;
  }

  return (
    <div>
      <HomeHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        onQuickSearch={handleQuickSearch}
      />

      <div className="bg-[#8B1A1A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-[#DAA520] text-xl font-bold">
                {events.length}+
              </div>
              <div className="text-white/70 text-xs">Sự kiện lịch sử</div>
            </div>

            <div>
              <div className="text-[#DAA520] text-xl font-bold">
                {periods.length || "Nhiều"}
              </div>
              <div className="text-white/70 text-xs">Thời kỳ lịch sử</div>
            </div>

            <div>
              <div className="text-[#DAA520] text-xl font-bold">
                {quizTopics.length || 5}
              </div>
              <div className="text-white/70 text-xs">Chủ đề trắc nghiệm</div>
            </div>

            <div>
              <div className="text-[#DAA520] text-xl font-bold">AI</div>
              <div className="text-white/70 text-xs">Trợ lý thông minh</div>
            </div>
          </div>
        </div>
      </div>

      <HomeFeatureCards />

      <HomeFeaturedEvents events={featuredEvents} />

      <HomeFeaturedFigures figures={featuredFigures} />

      <HomeRecentEvents events={recentEvents} />

      <HomeAiCta />
    </div>
  );
}