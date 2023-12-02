import { Flowbite, Tabs, type TabsRef } from "flowbite-react";
import { Dispatch, SetStateAction, useRef } from "react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { customTabTheme } from "../utils/theme";

interface IProps {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}

export const SetActiveTabProgrammatically: React.FC<IProps> = ({
  activeTab,
  setActiveTab,
}) => {
  // const [activeTab, setActiveTab] = useState<number>(0);
  const tabsRef = useRef<TabsRef>(null);
  const props = { activeTab, setActiveTab, tabsRef };

  return (
    <>
      <Flowbite theme={{ theme: customTabTheme }}>
        <Tabs.Group
          aria-label="Default tabs"
          style="fullWidth"
          ref={props.tabsRef}
          onActiveTabChange={(tab) => props.setActiveTab(tab)}
        >
          <Tabs.Item active title="Profile" icon={HiUserCircle}>
            This is{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              Profile tab's associated content
            </span>
            . Clicking another tab will toggle the visibility of this one for
            the next. The tab JavaScript swaps classes to control the content
            visibility and styling.
          </Tabs.Item>
          <Tabs.Item title="Dashboard" icon={MdDashboard}>
            This is{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              Dashboard tab's associated content
            </span>
            . Clicking another tab will toggle the visibility of this one for
            the next. The tab JavaScript swaps classes to control the content
            visibility and styling.
          </Tabs.Item>
          <Tabs.Item title="Settings" icon={HiAdjustments}>
            This is{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              Settings tab's associated content
            </span>
            . Clicking another tab will toggle the visibility of this one for
            the next. The tab JavaScript swaps classes to control the content
            visibility and styling.
          </Tabs.Item>
          <Tabs.Item title="Contacts" icon={HiClipboardList}>
            This is{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              Contacts tab's associated content
            </span>
            . Clicking another tab will toggle the visibility of this one for
            the next. The tab JavaScript swaps classes to control the content
            visibility and styling.
          </Tabs.Item>
          <Tabs.Item disabled title="Disabled">
            Disabled content
          </Tabs.Item>
        </Tabs.Group>
      </Flowbite>
      {/* <div className="pb-4 pt-2 text-sm text-gray-500 dark:text-gray-400">
        Active tab: {props.activeTab}
      </div>
      <Button.Group>
        <Button
          color="gray"
          onClick={() => props.tabsRef.current?.setActiveTab(0)}
        >
          Profile
        </Button>
        <Button
          color="gray"
          onClick={() => props.tabsRef.current?.setActiveTab(1)}
        >
          Dashboard
        </Button>
        <Button
          color="gray"
          onClick={() => props.tabsRef.current?.setActiveTab(2)}
        >
          Settings
        </Button>
        <Button
          color="gray"
          onClick={() => props.tabsRef.current?.setActiveTab(3)}
        >
          Contacts
        </Button>
      </Button.Group> */}
    </>
  );
};
