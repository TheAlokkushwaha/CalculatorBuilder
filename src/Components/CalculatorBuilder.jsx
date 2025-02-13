import React, { useState, useCallback } from "react";
import { Card } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Grip, X, Moon, Sun, RotateCcw, RotateCw, Plus } from "lucide-react";

const CalculatorBuilder = () => {
  const [components, setComponents] = useState([]);
  const [expression, setExpression] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [history, setHistory] = useState([[]]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const availableComponents = [
    ...Array(10)
      .fill()
      .map((_, i) => ({ type: "number", value: i.toString() })),
    { type: "operator", value: "+" },
    { type: "operator", value: "-" },
    { type: "operator", value: "*" },
    { type: "operator", value: "/" },
    { type: "operator", value: "=" },
    { type: "operator", value: "C" },
  ];

  const addToHistory = useCallback(
    (newComponents) => {
      const newHistory = [...history.slice(0, currentIndex + 1), newComponents];
      setHistory(newHistory);
      setCurrentIndex(currentIndex + 1);
    },
    [history, currentIndex]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setComponents(history[currentIndex - 1]);
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setComponents(history[currentIndex + 1]);
    }
  }, [currentIndex, history]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (draggedItem && draggedIndex === null) {
        const newComponents = [...components, draggedItem];
        setComponents(newComponents);
        addToHistory(newComponents);
      }
    },
    [components, draggedItem, draggedIndex, addToHistory]
  );

  const handleInternalDragStart = (e, index) => {
    setDraggedIndex(index);
    setDraggedItem(components[index]);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleInternalDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newComponents = [...components];
    const [removed] = newComponents.splice(draggedIndex, 1);
    newComponents.splice(index, 0, removed);

    setComponents(newComponents);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedIndex(null);
    addToHistory([...components]);
  };

  const removeComponent = useCallback(
    (index) => {
      const newComponents = components.filter((_, i) => i !== index);
      setComponents(newComponents);
      addToHistory(newComponents);
    },
    [components, addToHistory]
  );

  const handleCalculatorInput = useCallback(
    (value) => {
      if (value === "C") {
        setExpression("");
      } else if (value === "=") {
        try {
          const result = new Function("return " + expression)();
          setExpression(result.toString());
        } catch (error) {
          setExpression("Error");
        }
      } else {
        setExpression((prev) => prev + value);
      }
    },
    [expression]
  );

  const handlePaletteDragStart = useCallback((component) => {
    setDraggedItem(component);
    setDraggedIndex(null);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`w-full py-4 px-6 border-b ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Calculator Builder</h1>
          <div className="flex items-center gap-3">
            <Button
              variant={isDarkMode ? "secondary" : "outline"}
              size="sm"
              className={`px-3 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-100"
                  : "hover:bg-gray-100"
              }`}
              onClick={undo}
              disabled={currentIndex <= 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button
              variant={isDarkMode ? "secondary" : "outline"}
              size="sm"
              className={`px-3 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-100"
                  : "hover:bg-gray-100"
              }`}
              onClick={redo}
              disabled={currentIndex >= history.length - 1}
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Redo
            </Button>
            <div
              className={`w-px h-6 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              } mx-2`}
            ></div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`rounded-full ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-100"
                  : "hover:bg-gray-200"
              }`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Components Palette */}
        <Card
          className={`lg:col-span-1 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Components</h2>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Drag components to build your calculator
            </p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {availableComponents.map((component, index) => (
                <div
                  key={`${component.type}-${component.value}-${index}`}
                  draggable
                  onDragStart={() => handlePaletteDragStart(component)}
                  className={`
                    flex items-center justify-center p-3 rounded-lg cursor-move
                    transition-all duration-200 shadow-sm hover:shadow
                    ${
                      component.type === "operator"
                        ? isDarkMode
                          ? "bg-blue-600 hover:bg-blue-500"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                        : isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }
                  `}
                >
                  {component.value}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Calculator Preview */}
        <Card
          className={`lg:col-span-2 overflow-hidden ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Calculator Preview</h2>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Drag to rearrange buttons
            </p>
          </div>

          <div
            className={`p-6 ${isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}`}
          >
            <div
              className={`
              max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg
              ${isDarkMode ? "bg-gray-800" : "bg-white"}
            `}
            >
              {/* Calculator Display */}
              <div
                className={`
                p-6 
                ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}
              `}
              >
                <div
                  className={`
                  font-mono text-right truncate
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                  text-sm mb-1
                `}
                >
                  {expression || "0"}
                </div>
                <div
                  className={`
                  font-mono text-right truncate text-3xl font-semibold
                  ${isDarkMode ? "text-white" : "text-gray-900"}
                `}
                >
                  {expression || "0"}
                </div>
              </div>

              {/* Calculator Buttons */}
              <div
                className={`
                p-4 
                ${isDarkMode ? "bg-gray-800" : "bg-white"}
                ${
                  components.length === 0
                    ? "min-h-[300px] flex items-center justify-center"
                    : ""
                }
              `}
              >
                {components.length === 0 ? (
                  <div
                    className={`
                    text-center p-8 rounded-xl border-2 border-dashed
                    ${isDarkMode ? "border-gray-700" : "border-gray-200"}
                  `}
                  >
                    <Plus
                      className={`w-12 h-12 mx-auto mb-3 ${
                        isDarkMode ? "text-gray-600" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Drag components here to build your calculator
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {components.map((component, index) => (
                      <div
                        key={index}
                        className="relative group"
                        draggable
                        onDragStart={(e) => handleInternalDragStart(e, index)}
                        onDragOver={(e) => handleInternalDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                      >
                        <Button
                          variant={
                            component.type === "operator"
                              ? "default"
                              : "outline"
                          }
                          className={`
                            w-full h-14 text-lg cursor-move relative
                            transition-all duration-200
                            hover:scale-105
                            ${
                              component.type === "operator"
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : isDarkMode
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-white hover:bg-gray-50 border-gray-200"
                            }
                          `}
                          onClick={() => handleCalculatorInput(component.value)}
                        >
                          <Grip className="absolute h-3 w-3 left-2 top-1/2 -translate-y-1/2 opacity-30 group-hover:opacity-100 transition-opacity" />
                          {component.value}
                        </Button>
                        <button
                          onClick={() => removeComponent(index)}
                          className={`
                            absolute -top-2 -right-2 rounded-full p-1.5
                            transition-all duration-200
                            opacity-0 group-hover:opacity-100
                            scale-90 group-hover:scale-100
                            ${
                              isDarkMode
                                ? "bg-red-900 hover:bg-red-800"
                                : "bg-red-500 hover:bg-red-600"
                            }
                            shadow-lg
                          `}
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CalculatorBuilder;
