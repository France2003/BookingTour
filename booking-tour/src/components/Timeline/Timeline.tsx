// 👇 Bước 1: Khai báo props
interface TimelineProps {
  currentStep: number;
}

// 👇 Bước 2: Nhận currentStep từ props thay vì khai báo bên trong
const Timeline: React.FC<TimelineProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Chọn dịch vụ' },
    { id: 2, title: 'Nhập thông tin hành khách' },
    { id: 3, title: 'Thanh toán' },
    { id: 4, title: 'Xác nhận' },
  ];

  return (
    <div className="flex items-center justify-between w-full px-6 py-10 relative">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className="relative flex flex-col items-center flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 
                ${isCompleted ? 'bg-orange-500 border-orange-500' : 
                  isActive ? 'bg-white border-orange-500 animate-pulse' : 
                  'bg-white border-gray-300'}`}
            >
              <span className={`text-lg font-semibold 
                ${isCompleted ? 'text-white' : isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                {step.id}
              </span>
            </div>

            {/* Title */}
            <div className="mt-2 text-sm text-center font-medium text-gray-700">{step.title}</div>
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 -z-0">
                <div
                  className={`h-full transition-all duration-300 ${
                    step.id < currentStep ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  style={{ width: '100%', position: 'absolute', left: '50%', transform: 'translateX(5px)' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
