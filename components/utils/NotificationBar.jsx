import React, { useEffect, useState } from "react";
import { create } from "zustand";
import { BiX } from "react-icons/bi";
import {
  HiExclamationCircle,
  HiCheckCircle,
  HiExclamationTriangle,
  HiBell,
} from "react-icons/hi2";
import {
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import DateComponent from "@/components/utils/DateComponent";
import { getShortenedMessage } from "@/components/utils/TextUtil";
import { v4 as uuidv4 } from "uuid";
import { TbBell } from "react-icons/tb";

// 创建一个状态管理器来存储通知状态
export const useNotification = create((set) => ({
  notifications: [],
  historyList: [],
  clearNotifications: () => set({ notifications: [] }),
  clearHistory: () => set({ historyList: [] }),
  addNotification: (message, type = "info", title = "") =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: uuidv4(), message, type, time: Date.now(), title },
      ],
      historyList: [
        ...state.historyList,
        { id: uuidv4(), message, type, time: Date.now(), title },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),
  removeHistory: (id) =>
    set((state) => ({
      historyList: state.historyList.filter(
        (notification) => notification.id !== id
      ),
    })),
}));

// 通知栏组件
const NotificationBar = () => {
  const [notifications, removeNotification] = useNotification((state) => [
    state.notifications,
    state.removeNotification,
  ]);

  // 自动关闭通知的效果
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].id); // 移除第一个通知
      }, 5000); // 5秒后自动关闭
      return () => clearTimeout(timer); // 组件卸载时清除定时器
    }
  }, [notifications, removeNotification]);

  return (
    <div className="fixed  bottom-0 right-0 z-50 p-4 flex flex-col items-end">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="bg-white w-[300px] p-4 rounded-md mb-4 flex items-center shadow-md transition-transform duration-500 transform translate-y-0 relative"
          onMouseEnter={(e) =>
            e.currentTarget
              .querySelector("button")
              .classList.remove("opacity-0")
          }
          onMouseLeave={(e) =>
            e.currentTarget.querySelector("button").classList.add("opacity-0")
          }
        >
          <label className="m-2">{getIcon(notification.type)}</label>
          <span>{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-red-500 p-2 rounded-md opacity-0 absolute top-0 right-0 transition-opacity duration-300"
          >
            <BiX size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export const NotificationList = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 处理点击 ListboxItem
  const handleListboxItemClick = (notification) => {
    setSelectedNotification(notification);
    onOpen();
  };

  const [historyList] = useNotification((state) => [state.historyList]);

  return (
    <>
      <Listbox variant="flat" aria-label="Listbox menu with sections">
        {historyList
          .slice()
          .reverse()
          .map((notification, index) => (
            <ListboxItem
              key={index}
              description={
                <DateComponent
                  dateString={notification.time}
                  label={"时间"}
                  dateFormat="yyyy-MM-dd HH:mm:ss"
                />
              }
              onPress={() => handleListboxItemClick(notification)}
              className={getColorClass(notification.type)}
              color={getColor(notification.type)}
              startContent={getIcon(notification.type)}
            >
              {getShortenedMessage(notification.message, 250)}
            </ListboxItem>
          ))}
      </Listbox>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center text-sm">
                <label className="mr-2">
                  {getIcon(selectedNotification?.type)}
                </label>
                {selectedNotification?.title}
              </ModalHeader>
              <ModalBody>
                {selectedNotification?.message}
                <div className="text-sm text-gray-500">
                  <DateComponent
                    dateString={selectedNotification?.time}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                  />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

// 通知栏组件
export const NotificationInfo = () => {
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [historyList, removeHistory] = useNotification((state) => [
    state.historyList,
    state.removeHistory,
  ]);

  // 处理点击 ListboxItem
  const handleListboxItemClick = (notification) => {
    setSelectedNotification(notification);
    onOpen();
  };

  return (
    <div className="fixed bottom-0 right-0 z-50  flex flex-col items-end bg-white shadow-md">
      {isOpenPopup ? (
        <>
          <div className="w-full p-2 flex justify-between items-center">
            <span className="text-sm text-gray-500">通知日志</span>
            <BiX onClick={() => setOpenPopup(false)} />
          </div>
          <div className="w-[300px] overflow-auto h-[300px] px-2">
            <Listbox variant="flat" aria-label="Listbox menu with sections">
              {historyList
                .slice()
                .reverse()
                .map((notification, index) => (
                  <ListboxItem
                    key={index}
                    description={
                      <DateComponent
                        dateString={notification.time}
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                      />
                    }
                    onPress={() => handleListboxItemClick(notification)}
                    className={getColorClass(notification.type)}
                    color={getColor(notification.type)}
                    startContent={getIcon(notification.type)}
                  >
                    {getShortenedMessage(notification.message, 250)}
                  </ListboxItem>
                ))}
            </Listbox>
          </div>
        </>
      ) : (
        <div
          onClick={() => setOpenPopup(true)}
          className="w-[25px]  h-[25px] text-[#6B7280] flex justify-center items-center"
        >
          <TbBell size={18} />
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center text-sm">
                <label className="mr-2">
                  {getIcon(selectedNotification?.type)}
                </label>
                {selectedNotification?.title}
              </ModalHeader>
              <ModalBody>
                {selectedNotification?.message}
                <div className="text-sm text-gray-500">
                  <DateComponent
                    dateString={selectedNotification?.time}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                  />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

// 根据通知类型获取相应的颜色
const getColor = (type) => {
  switch (type) {
    case "error":
      return "danger";
    case "success":
      return "success";
    case "info":
    default:
      return;
  }
};

// 根据通知类型获取相应的类名
const getColorClass = (type) => {
  switch (type) {
    case "error":
      return "text-danger";
    case "success":
      return "text-success";
    case "info":
    default:
      return;
  }
};

// 根据通知类型获取相应的图标
const getIcon = (type) => {
  switch (type) {
    case "error":
      return <HiExclamationTriangle className={cn("text-danger")} />;
    case "success":
      return <HiCheckCircle className={cn("text-success")} />;
    case "info":
    default:
      return <HiExclamationCircle />;
  }
};

export default NotificationBar;
