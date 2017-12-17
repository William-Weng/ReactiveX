//
//  ViewController.swift
//  RxSwift_TableView
//
//  Created by Yu Pin Weng on 2017/12/17.
//  Copyright © 2017年 Yu Pin Weng. All rights reserved.
//

import UIKit
import RxCocoa
import RxSwift
import RxDataSources

class ViewController: UIViewController {
    
    @IBOutlet weak var rxTableView: UITableView!
    
    let disposeBag = DisposeBag()
    let cellIdentifier = "RxCell"
    let dataSource = RxTableViewSectionedReloadDataSource<SectionModel<String, Double>>( configureCell: { (_, tableView, indexPath, element) in
        let cell = tableView.dequeueReusableCell(withIdentifier: "RxCell")!
        cell.textLabel?.text = "\(element) @ row \(indexPath.row)"
        return cell
    }, titleForHeaderInSection: { dataSource, sectionIndex in
        return dataSource[sectionIndex].model
    })
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        rxTableViewTest()
    }
}

// MARK: - RxSwift
extension ViewController {
    
    func rxTableViewTest() {
        
        let dataSource = self.dataSource
        let items = Observable.just([
            SectionModel(model: "First", items:[1.0,2.0,3.0]),
            SectionModel(model: "Second", items:[1.0,2.0,3.0]),
            SectionModel(model: "Third", items:[1.0,2.0,3.0])])
        
        dataSource.configureCell = { (_, tableView, indexPath, element) in
            let cell = tableView.dequeueReusableCell(withIdentifier: self.cellIdentifier)!
            cell.textLabel?.text = "\(element) @ row \(indexPath.row)"
            return cell
        }
        
        dataSource.titleForHeaderInSection = { (dataSource, sectionIndex) in
            return dataSource[sectionIndex].model
        }
        
        items.bind(to: rxTableView.rx.items(dataSource: dataSource))
            .disposed(by: disposeBag)
        
        /// func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath)
        rxTableView.rx
            .itemSelected
            .map { indexPath in
                return (indexPath, dataSource[indexPath])
            }
            .subscribe(onNext: { indexPath, model in
                print("Tapped `\(model)` @ \(indexPath)")
            })
            .disposed(by: disposeBag)
        
        /// rxTableView.delegate = self
        rxTableView.rx
            .setDelegate(self)
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource / UITableViewDelegate
extension ViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCellEditingStyle { return .none }
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat { return 80.0 }
}



