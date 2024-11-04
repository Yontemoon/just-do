import { dateUtils } from "@/helper/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";

const useSearchDate = () => {
  const navigate = useNavigate({ from: "/" });
  const { hashtag } = useSearch({ from: "/" });

  function yesterday() {
    navigate({
      search: (prev) => ({
        ...prev,
        date: dateUtils.getYesterday(prev.date as string),
      }),
    });
  }

  function today() {
    navigate({
      search: (prev) => ({
        ...prev,
        date: dateUtils.getToday(),
      }),
    });
  }

  function tomorrow() {
    navigate({
      search: (prev) => ({
        ...prev,
        date: dateUtils.getTomorrow(prev.date as string),
      }),
    });
  }

  function hashFilter(hash: string) {
    if (hash === hashtag) {
      navigate({
        search: (prev) => {
          const newParams = { ...prev };
          delete newParams.hashtag;
          return newParams;
        },
      });
    } else {
      navigate({
        search: (prev) => {
          return {
            ...prev,
            hashtag: hash,
          };
        },
      });
    }
  }

  function displayAll(checked: boolean) {
    console.log(checked)
    navigate({
      search: (prev) => ({
        ...prev,
        date_all: checked,
        date: checked ? undefined : dateUtils.getToday(),
        hashtag: undefined,
      }),
    });
  }

  return { yesterday, today, tomorrow, hashFilter, displayAll };
};

export default useSearchDate;
